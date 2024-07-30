package handler

import (
	"net/http"
)

func Ping(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, map[string]string{"message": "pong"})
}
