package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	propertiesdto "housy/dto/properties"
	dto "housy/dto/result"
	"housy/models"
	"housy/repositories"
	"net/http"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"gorm.io/datatypes"
)

type handlerProperty struct {
	PropertyRepository repositories.PropertyRepository
}

func HandlerProperty(PropertyRepository repositories.PropertyRepository) *handlerProperty {
	return &handlerProperty{PropertyRepository}
}

func (h *handlerProperty) FindProperties(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	properties, err := h.PropertyRepository.FindProperties()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: properties}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerProperty) GetProperty(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	property, err := h.PropertyRepository.GetProperty(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: property}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerProperty) AddProperty(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// get data user token
	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))
	userRole := int(userInfo["list_as_id"].(float64))

	if userRole != 1 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "unauthorized as Owner"}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Get dataFile from midleware and store to filepath variable here ...
	dataContex := r.Context().Value("dataFile") // add this code
	filepath := dataContex.(string)             // add this code

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "Housy"})

	if err != nil {
		fmt.Println(err.Error())
	}

	price, _ := strconv.Atoi(r.FormValue("price"))
	bedroom, _ := strconv.Atoi(r.FormValue("bedroom"))
	bathroom, _ := strconv.Atoi(r.FormValue("bathroom"))
	houseSize, _ := strconv.Atoi(r.FormValue("house_size"))

	request := propertiesdto.PropertyRequest{
		Name:        r.FormValue("name"),
		CityId:      r.FormValue("city_id"),
		Address:     r.FormValue("address"),
		Price:       float64(price),
		TypeRent:    r.FormValue("type_rent"),
		Amenities:   datatypes.JSON(r.FormValue("amenities")),
		Bedroom:     bedroom,
		Bathroom:    bathroom,
		Description: r.FormValue("description"),
		HouseSize:   houseSize,
	}

	validation := validator.New()
	err = validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var cities_id int
	if request.CityId == "Jakarta" {
		cities_id = 1
	} else if request.CityId == "Bandung" {
		cities_id = 2
	} else if request.CityId == "Samarinda" {
		cities_id = 3
	} else if request.CityId == "Medan" {
		cities_id = 4
	}

	property := models.Property{
		Name:        request.Name,
		CityId:      cities_id,
		Address:     request.Address,
		Price:       request.Price,
		TypeRent:    request.TypeRent,
		Amenities:   request.Amenities,
		Bedroom:     request.Bedroom,
		Bathroom:    request.Bathroom,
		Description: request.Description,
		HouseSize:   request.HouseSize,
		Image:       resp.SecureURL,
		UserID:      userId,
	}

	data, err := h.PropertyRepository.AddProperty(property)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	property, _ = h.PropertyRepository.GetProperty(data.ID)

	dataProperty := propertiesdto.PropertyResponse{
		ID:          property.ID,
		Name:        property.Name,
		City:        property.City,
		Address:     property.Address,
		Price:       property.Price,
		TypeRent:    property.TypeRent,
		Amenities:   property.Amenities,
		Bedroom:     property.Bedroom,
		Bathroom:    property.Bathroom,
		Description: property.Description,
		HouseSize:   property.HouseSize,
		Image:       property.Image,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: dataProperty}
	json.NewEncoder(w).Encode(response)
}

