package app

import (
	"net/http"

	stmongo "st/backend/app/mongo"

	"github.com/gin-gonic/gin"
)

type App struct {
	server *gin.Engine
}

func New() *App {
	return &App{
		server: gin.Default(),
	}
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

	a.server.Run()

}
