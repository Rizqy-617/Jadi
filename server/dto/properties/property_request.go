package propertiesdto

import (
	"gorm.io/datatypes"
)

type PropertyRequest struct {
	Name        string         `json:"name" form:"name" validate:"required"`
	CityId      string         `json:"city_id" form:"city_id" validate:"required"`
	Address     string         `json:"address" form:"address" validate:"required"`
	Price       float64        `json:"price" form:"price" validate:"required"`
	TypeRent    string         `json:"type_rent" form:"type_rent" validate:"required"`
	Amenities   datatypes.JSON `json:"amenities" form:"amenities" validate:"required"`
	Bedroom     int            `json:"bedroom" form:"bedroom" validate:"required"`
	Bathroom    int            `json:"bathroom" form:"bathroom" validate:"required"`
	Description string         `json:"description" form:"description" validate:"required"`
	HouseSize   int            `json:"house_size" form:"house_size" validate:"required"`
	Image       string         `json:"image" form:"image"`
}
