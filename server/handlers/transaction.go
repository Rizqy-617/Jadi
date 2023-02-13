package handlers

import (
	"encoding/json"
	"fmt"
	dto "housy/dto/result"
	transactiondto "housy/dto/transaction"
	"housy/models"
	"housy/repositories"
	"log"
	"net/http"
	"os"
	"strconv"

	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"github.com/midtrans/midtrans-go"
	"gopkg.in/gomail.v2"

	"github.com/midtrans/midtrans-go/snap"
)

type handleTransaction struct {
	TransactionRepository repositories.TransactionRepository
}

func HandleTransaction(TransactionRepository repositories.TransactionRepository) *handleTransaction {
	return &handleTransaction{TransactionRepository}
}

func (h *handleTransaction) FindTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userId := int(userInfo["id"].(float64))


	if userListAs != 1 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.FindTransaction(userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((err.Error()))
		return
	}
	fmt.Println(transaction)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) GetTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) GetMyBooking(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userID := int(userInfo["id"].(float64))
	fmt.Println("ini User", userID)

	if userListAs != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.GetMyBooking(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("satu")
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) History(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userID := int(userInfo["id"].(float64))

	if userListAs != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.HistoryTenant(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("satu")
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) HistoryOwner(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userListAs := int(userInfo["list_as_id"].(float64))
	userID := int(userInfo["id"].(float64))

	if userListAs != 1 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.HistoryOwner(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("satu")
		json.NewEncoder(w).Encode((err.Error()))
		return
	}

	fmt.Println("ini data transaction", transaction)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) AddTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))
	userRole := int(userInfo["list_as_id"].(float64))

	if userRole != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	request := new(transactiondto.TransactionRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		fmt.Println("satu")
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		fmt.Println("valid")
		json.NewEncoder(w).Encode(response)
		return
	}

	var TransIdIsMatch = false
	var TransactionId int
	for !TransIdIsMatch {
		TransactionId = userId + request.PropertyID + int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(TransactionId)
		if transactionData.ID == 0 {
			TransIdIsMatch = true
		}
	}


	checkin, _ := time.Parse("2006-01-02", request.Checkin)
	checkout, _ := time.Parse("2006-01-02", request.Checkout)

	transaction := models.Transaction{
		ID: TransactionId,
		PropertyID: request.PropertyID,
		Checkin:    checkin,
		Checkout:   checkout,
		UserID:     userId,
		Total:      request.Total,
		Status:     request.Status,
	}

	fmt.Println(transaction)

	data, err := h.TransactionRepository.AddTransaction(transaction)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, _ = h.TransactionRepository.GetTransaction(data.ID)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: transaction}
	json.NewEncoder(w).Encode(response)
}

func (h *handleTransaction) CreateMidtrans(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userRole := int(userInfo["list_as_id"].(float64))

	if userRole != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}
	
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	dataTransactions, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
		return
	}

	fmt.Println("ini data transaksi", dataTransactions)

	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
		  OrderID:  strconv.Itoa(dataTransactions.ID),
		  GrossAmt: int64(dataTransactions.Total),
		}, 
		CreditCard: &snap.CreditCardDetails{
		  Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
		  FName: dataTransactions.User.Fullname,
		  Email: dataTransactions.User.Email,
		},
	}

	snapResp, _ := s.CreateTransaction(req)

	fmt.Println(snapResp)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: snapResp}
	json.NewEncoder(w).Encode(response)
}


func SendMail(status string, transaction models.Transaction) {
	fmt.Println(os.Getenv("EMAIL_SYSTEM"), os.Getenv("PASSWORD_SYSTEM"))
	if status != transaction.Status && (status == "success") {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "Rizqy2205 <rizqyandriansyah2205@gmail.com>"
		var CONFIG_AUTH_EMAIL = os.Getenv("EMAIL_SYSTEM")
		var CONFIG_AUTH_PASSWORD = os.Getenv("PASSWORD_SYSTEM")

	
		var propertyName = transaction.Property.Name
		var price = strconv.Itoa(int(transaction.Property.Price))

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.User.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        h1 {
        color: brown;
        }
      </style>
      </head>
      <body>
      <h2>Product payment :</h2>
      <ul style="list-style-type:none;">
        <li>Name : %s</li>
        <li>Total payment: Rp.%s</li>
        <li>Status : <b>%s</b></li>
      </ul>
      </body>
    </html>`, propertyName, price, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		fmt.Println("Ini data dialer", dialer)
		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}

		log.Println("Mail sent! to " + transaction.User.Email)
	}
}

func (h *handleTransaction) Notification(w http.ResponseWriter, r *http.Request) {
	var notificationPayload map[string]interface{}

	err := json.NewDecoder(r.Body).Decode(&notificationPayload)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId, _ := strconv.Atoi(notificationPayload["order_id"].(string))

	transaction, _ := h.TransactionRepository.GetOneTransaction(orderId)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.TransactionRepository.UpdateTransaction("pending", orderId)
		} else if fraudStatus == "accept" {
			SendMail("success", transaction)
			h.TransactionRepository.UpdateTransaction("success", orderId)
		}
	} else if transactionStatus == "settlement" {
		h.TransactionRepository.UpdateTransaction("success", orderId)
	} else if transactionStatus == "deny" {
		SendMail("failed", transaction)
		h.TransactionRepository.UpdateTransaction("success", orderId)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		SendMail("failed", transaction)
		h.TransactionRepository.UpdateTransaction("failed", orderId)
	} else if transactionStatus == "pending" {
		h.TransactionRepository.UpdateTransaction("pending", orderId)
	}

	w.WriteHeader(http.StatusOK)
}

