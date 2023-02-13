package handlers

import (
	"encoding/json"
	"fmt"
	dto "housy/dto/result"
	"housy/models"
	"housy/repositories"
	"net/http"
)

type handlerFilter struct {
	FilterRepository repositories.FilterRepository
}

func HandlerFilter(FilterRepository repositories.FilterRepository) *handlerFilter {
	return &handlerFilter{FilterRepository}
}

func (h *handlerFilter) SingleParameter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	singleParams := r.URL.Query().Get("property")

	fmt.Println(singleParams)

	property, _ := h.FilterRepository.FindProperty()

	fmt.Println("ini property", property)

	dataProperty := models.Property{}

	for _, data := range property {
		if singleParams == data.Name {
			dataProperty = models.Property{
				ID:   data.ID,
				Name: singleParams,
			}
		}
	}

	propertyId := dataProperty.ID
	fmt.Println("ini propertyId", propertyId)

	houses, err := h.FilterRepository.SingleParameter(propertyId)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "City not found"}
		fmt.Println("2")
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: houses}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerFilter) MultiParameter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	params := r.URL.Query()

	houses, err := h.FilterRepository.MultiParameter(params)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: houses}
	json.NewEncoder(w).Encode(response)
}
