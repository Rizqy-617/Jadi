package repositories

import (
	"housy/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	AddTransaction(transaction models.Transaction) (models.Transaction, error)
	CreateMidtrans(id int) (models.Transaction, error)
	FindTransaction(id int) ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	UpdateTransaction(status string, id int) (error)
	GetMyBooking(ID int) (models.Transaction, error)
	HistoryTenant(ID int) ([]models.Transaction, error)
	HistoryOwner(userId int) ([]models.Transaction, error)
	GetOneTransaction(ID int) (models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) AddTransaction(Transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Preload("Property.City").Preload("User").Create(&Transaction).Error

	return Transaction, err
}

func (r *repository) CreateMidtrans(id int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Where("id = ?", id).First(&Transaction).Error

	return Transaction, err
}

func (r *repository) FindTransaction(id int) ([]models.Transaction, error) {
	var Transaction []models.Transaction
	

	err := r.db.Preload("Property.City").Preload("User").Table("transactions").Select("transactions.id, transactions.property_id, transactions.checkin, transactions.checkout, transactions.total, transactions.status, transactions.user_id").Joins("left join properties on properties.id = transactions.property_id").Where("properties.user_id = ?", id).Find(&Transaction).Error

	return Transaction, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").Preload("User").First(&Transaction, ID).Error

	return Transaction, err
}

func (r *repository) UpdateTransaction(status string, id int) (error) {
	var transaction models.Transaction
	r.db.Preload("Property").First(&transaction, id)
	transaction.Status = status
	err := r.db.Preload("Property.City").Preload("User").Save(&transaction).Error

	return err
}

func (r *repository) GetMyBooking(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Where("user_id = ? AND status = ?", ID, "waiting payment").First(&Transaction).Error

	return Transaction, err
}

func (r *repository) HistoryTenant(ID int) ([]models.Transaction, error) {
	var Transaction []models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Where("user_id = ?", ID).Find(&Transaction).Error

	return Transaction, err
}

func (r *repository) HistoryOwner(userId int) ([]models.Transaction, error) {
	var Transaction []models.Transaction
	err := r.db.Preload("Property.City").Preload("User").Where("status = ? AND user_id = ?", "success", userId).Find(&Transaction).Error

	return Transaction, err
}

func (r *repository) GetOneTransaction(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("Property").Preload("Property.City").Preload("User").First(&Transaction, ID).Error

	return Transaction, err
}


