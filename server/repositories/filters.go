package repositories

import (
	"fmt"
	"housy/models"
	"net/url"
	"strconv"

	// "strconv"

	"gorm.io/gorm"
)

type FilterRepository interface {
	FindProperty() ([]models.Property, error)
	SingleParameter(params int) ([]models.Property, error)
	MultiParameter(params url.Values) ([]models.Property, error)
}

func RepositoryFilter(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindProperty()([]models.Property, error){
	var property []models.Property
	err := r.db.Find(&property).Error

	return property, err
}

func (r *repository) SingleParameter(params int) ([]models.Property, error) {
	var properties []models.Property
	err := r.db.Where("id = ?", params).Preload("City").Find(&properties).Error
	fmt.Println(properties)
	return properties, err
}

func (r *repository) MultiParameter(params url.Values) ([]models.Property, error) {
	var properties []models.Property

	typeRent := params.Get("typeRent")
	price, _ := strconv.ParseFloat(params.Get("price"), 64) 
	bedroom, _ := strconv.Atoi(params.Get("bedroom"))
	bathroom, _ := strconv.Atoi(params.Get("bathroom"))
	amenities := params.Get("amenities")


	err := r.db.Where("type_rent = ? AND price < ? AND bedroom = ? AND bathroom = ? AND amenities = ?", typeRent, price, bedroom, bathroom, amenities).Preload("City").Find(&properties).Error

	return properties, err
}
