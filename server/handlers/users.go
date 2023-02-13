package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	dto "housy/dto/result"
	usersdto "housy/dto/users"
	"housy/models"
	"housy/pkg/bcrypt"
	"housy/repositories"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gorilla/mux"
)

type handlerUser struct {
	UserRepository repositories.UserRepository
}

func HandlerUser(UserRepository repositories.UserRepository) *handlerUser {
	return &handlerUser{UserRepository}
}

func (h *handlerUser) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: user}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) ChangePassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	request := usersdto.ChangePasswordRequest {
		OldPassword: r.FormValue("old_password"),
		ConfirmNewPassword: r.FormValue("confirm_new_password"),
	}

	// Check password
	isValid := bcrypt.CheckPasswordHash(request.OldPassword, user.Password)
	if !isValid {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "wrong Username or Password"}
		json.NewEncoder(w).Encode(response)
		return
	}

	password, err := bcrypt.HashingPassword(request.ConfirmNewPassword)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	addData := models.User{
		ID: user.ID,
		Fullname: user.Fullname,
		Username: user.Username,
		Email: user.Email,
		Password: password,
		ListAsId: user.ListAsId,
		Gender: user.Gender,
		Phone: user.Phone,
		Address: user.Address,
		Image: user.Image,
		CreatedAt: user.CreatedAt,
		UpdatedAt: time.Now(),
	}


	data, err := h.UserRepository.ChangePassword(addData)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	changePasswordResponse := usersdto.ChangePasswordResponse{
		Username: data.Username,
		Message: "Change Password Success",
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: changePasswordResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) ChangeImage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	user, err := h.UserRepository.GetUser(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	dataContext := r.Context().Value("dataFile")
	filepath := dataContext.(string)

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err  := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "Profile_Picture"})

	if err != nil {
		fmt.Println(err.Error())
	}

	addData := models.User{
		ID: user.ID,
		Fullname: user.Fullname,
		Username: user.Username,
		Email: user.Email,
		Password: user.Password,
		ListAsId: user.ListAsId,
		Gender: user.Gender,
		Phone: user.Phone,
		Address: user.Address,
		Image: resp.SecureURL,
		CreatedAt: user.CreatedAt,
		UpdatedAt: time.Now(),
	}

	data, err := h.UserRepository.ChangeImage(addData)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	changePasswordResponse := usersdto.ChangeImageResponse{
		Username: data.Username,
		Message: "Change Image Success",
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: changePasswordResponse}
	json.NewEncoder(w).Encode(response)
}
