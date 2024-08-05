package app

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/vicanso/go-charts/v2"
	"net/http"
	stmongo "st/backend/app/mongo"
)

type App struct {
	server *gin.Engine
}

func New() *App {
	return &App{
		server: gin.Default(),
	}
}

type ActivityData struct {
	name     []string
	duration []float64
}

func activityDataCreate() *ActivityData {
	return &ActivityData{
		name:     make([]string, 0),
		duration: make([]float64, 0),
	}
}

func (actd *ActivityData) push_name(element string) {
	actd.name = append(actd.name, element)
}

func (actd *ActivityData) push_dur(element float64) {
	actd.duration = append(actd.duration, element)
}

func (a *App) Run() {
	mongoc := stmongo.Initialize()

	a.server.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	a.server.GET("/user/:id", func(c *gin.Context) {
		id := c.Param("id")

		if err := stmongo.ValidateID(id); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		user := stmongo.FindUser(mongoc.Client, id)
		activities := stmongo.FindActivities(mongoc.Client, id)

		c.JSON(http.StatusOK, gin.H{
			"user":       user,
			"activities": activities,
		})
	})

	activityList := activityDataCreate()

	a.server.GET("/user/:id/graph", func(c *gin.Context) {
		id := c.Param("id")

		if err := stmongo.ValidateID(id); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		activities := stmongo.FindActivities(mongoc.Client, id)

		for _, app := range activities {
			name := app["name"].(string)
			duration := app["duration"].(int32) / 60000

			activityList.push_name(name)
			activityList.push_dur(float64(duration))
		}

		fmt.Print(activityList)
		values := [][]float64{activityList.duration}

		png, err := charts.BarRender(
			values,
			charts.TitleTextOptionFunc("Minutes elapsed"),
			charts.XAxisDataOptionFunc(activityList.name),
			charts.WidthOptionFunc(1080),
			charts.HeightOptionFunc(720),
			charts.ThemeOptionFunc(charts.ThemeDark),
		)
		if err != nil {
			panic(err)
		}

		buf, err := png.Bytes()
		if err != nil {
			panic(err)
		}

		c.Header("Content-Type", "image/png")
		c.Data(http.StatusOK, "image/png", buf)

	})

	a.server.Run()

}
