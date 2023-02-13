package propertiesdto

import (
	"housy/models"

	"gorm.io/datatypes"
)

type PropertyResponse struct {
	ID          int            `json:"id"`
	Name        string         `json:"name" `
	City        models.City    `json:"city"`
	Address     string         `json:"address" `
	Price       float64        `json:"price" `
	TypeRent    string         `json:"type_rent" `
	Amenities   datatypes.JSON `json:"amenities" `
	Bedroom     int            `json:"bedroom" `
	Bathroom    int            `json:"bathroom" `
	Description string         `json:"description"`
	HouseSize   int            `json:"house_size"`
	Image       string         `json:"image" `
	UserID      int            `json:"user_id"`
	User        models.User    `json:"user"`
}
