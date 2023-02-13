package transactiondto

import (
	"housy/models"
	"time"
)

type TransactionResponse struct {
	ID         int                         `json:"id" `
	PropertyID int                         `json:"property_id" `
	Property   models.PropertyResponse     `json:"property" `
	Checkin    time.Time                   `json:"checkin" `
	Checkout   time.Time                   `json:"checkout" `
	Status     string                      `json:"status" `
	Total      float64                     `json:"total" `
	UserID     int                         `json:"user_id"`
	User       models.UsersProfileResponse `json:"user"`
}
