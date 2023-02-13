package routes

import (
	"housy/handlers"
	"housy/pkg/middleware"
	"housy/pkg/mysql"
	"housy/repositories"

	"github.com/gorilla/mux"
)

func PropertyRoutes(r *mux.Router) {
	propertyRepository := repositories.RepositoryProperty(mysql.DB)
	h := handlers.HandlerProperty(propertyRepository)

	r.HandleFunc("/properties", h.FindProperties).Methods("GET")
	r.HandleFunc("/property/{id}", h.GetProperty).Methods("GET")
	r.HandleFunc("/property", middleware.Auth(middleware.UploadFile(h.AddProperty))).Methods("POST")
}
