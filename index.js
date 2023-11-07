import { menuArray as menuArr } from "/menuArray.js"

const menuContainer = document.getElementById('menu-container')
const orders = []

document.addEventListener('click', e => {
    if (e.target.dataset.addMenu) {        
        handleAddMenuClick(e.target.dataset.addMenu)
    } else if (e.target.dataset.removeOrder){
        handleRemoveOrderClk(e.target.dataset.removeOrder)
    } else if (e.target.id === 'complete-order-btn'){
        handleCompleteOrderBtn()
    }
})

document.addEventListener('submit', e => {
    e.preventDefault()
    handlePayBtnClk()
})

function handleAddMenuClick(menuId) {    
    addOrders(menuId)
    renderOrders()
}

function addOrders(menuId) {
    const targetOrderArr = orders.filter(order => order.id === +menuId)

    targetOrderArr.length ? targetOrderArr[0].quantity++ 
        : orders.push({
                id: +menuId, 
                quantity: 1, 
                name: menuArr[menuId].name, 
                price: menuArr[menuId].price
            })
}

function renderOrders() {
    const orderedContainer = document.getElementById('ordered-container')
    if (orders.length) {
        orderedContainer.innerHTML = `
            <h3 class="center">Your Orders</h3>
            ${getOrdersHTML()}
            <div class="total-price">
                <h3>Total Price:</h3>
                <div class="order-numbers">
                    $${orders.reduce((total, order) => 
                        total + (order.quantity * order.price),0).toFixed(2)}
                </div>
            </div>
            <button id="complete-order-btn">Complete Order</button>
        `
    } else {
        orderedContainer.innerHTML = ''
    }
}

function getOrdersHTML() {
    return orders.map( order => `
        <div class="order">
            <div class="order-desc">${order.quantity} ${order.name}</div>
            <button class="remove-btn" data-remove-order="${order.id}">remove</button>
            <div class="order-numbers">$${(order.quantity * order.price).toFixed(2)}</div>
        </div>
    `).join('')
}

function handleRemoveOrderClk(orderId) {
    const targetObj = orders.filter( order => order.id === + orderId )[0]
    targetObj.quantity--
    const targetIndex = orders.findIndex( order => order.quantity === 0)
    if (targetIndex >= 0){
        orders.splice(targetIndex, 1)
    }
    renderOrders()
}

function handleCompleteOrderBtn() {
    document.getElementById('modal').style.display = 'flex'
}

function handlePayBtnClk(){
    const cardForm = document.getElementById('card-form')
    const payFormData = new FormData(cardForm)
    const fullName = payFormData.get('fullName')
    
    document.getElementById('modal').style.display = 'none'
    
    orders.splice(0, orders.length)
    
    const orderedContainer = document.getElementById('ordered-container')
    
    orderedContainer.innerHTML = `
        <div class="confirm-order-message">
            <p>Thanks, ${fullName}! Your order is on its way!</p>
        </div>
    `
}

function getMenuHTML(arr) {    
    return arr.map( menu => `
        <div class="menu-item">
            <p class="emoji">${menu.emoji}</p>
            <div class="menu-info">
                <h3>${menu.name}</h3>
                <p class="ingredients">${menu.ingredients.join(', ')}</p>
                <p class="price">$${menu.price.toFixed(2)}</p>
            </div>
            <button class="add-menu-btn" data-add-menu="${menu.id}">+</button>
        </div>
    `).join('')
}

menuContainer.innerHTML = getMenuHTML(menuArr)

