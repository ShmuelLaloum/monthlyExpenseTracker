const inputExpend = document.getElementById("expend");
const inputAmount= document.getElementById("amount");
const inputCategory = document.getElementById("category"); 
const inputDate= document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const cards = document.getElementById("cards");
const deleteAllBtn = document.getElementById("deleteAllBtn");

let cardList = JSON.parse(localStorage.getItem("cards")) || [];

let currentFilter = "all";

renderCards(currentFilter);

const container = document.getElementById("container");
const filterContainer = document.createElement("div");
filterContainer.id = "filterContainer";
container.insertAdjacentElement("afterend", filterContainer);

const categories = ["all", "אוכל", "נסיעות", "בילויים", "חשבונות", "אחר"];
const filterButtons = [];

categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filterBtn";
    btn.dataset.category = cat;
    btn.textContent = cat === "all" ? "הכל" : cat;
    filterContainer.appendChild(btn);
    filterButtons.push(btn);

    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));   
        btn.classList.add("active");   
        currentFilter = btn.dataset.category; 
        renderCards(currentFilter);
    });
});

filterButtons[0].classList.add("active");

inputAmount.addEventListener("input", () => {
    if (inputAmount.value.length > 10) {
        inputAmount.value = inputAmount.value.slice(0, 10);
    }
});

function createCard(cardData, index, filter) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;

    const title = document.createElement("h3");
    title.textContent = "תיאור הוצאה: " + cardData.expend;

    const amount = document.createElement("h3");
    amount.textContent = "סכום הוצאה: " + cardData.amount;

    const category = document.createElement("h3");
    category.textContent = "קטגוריה: " + cardData.category;

    const date = document.createElement("h3");
    date.textContent = "תאריך: " + cardData.date;

    const delBtn = document.createElement("button");
    delBtn.className = "deleteBtn";
    delBtn.textContent = "מחק";

    delBtn.addEventListener("click", () => {
        cardList = cardList.filter(card => card.id !== cardData.id);
        localStorage.setItem("cards", JSON.stringify(cardList));
        renderCards(filter);
    });

    const container = [title,amount,category,date,delBtn];
    container.forEach(element => {
        card.appendChild(element);
    });

    return card;
}


function renderCards(filter = "all") {
    cards.innerHTML = "";

    cardList.forEach((cardData, index) => {
        if (filter !== "all" && cardData.category !== filter) return;

        const card = createCard(cardData, index, filter);
        cards.appendChild(card);
    });

    updateSummary();
}


function updateSummary() {
    const summaryDiv = document.getElementById("summary");

    summaryDiv.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "סיכום חודשי:";
    summaryDiv.appendChild(title);

    const summary = {};
    cardList.forEach(card => {
        const { month, year } = extractMonthYear(card.date);
        const key = `${month}-${year}`;

        if (!summary[key]) summary[key] = 0;
        summary[key] += Number(card.amount);
    });

    for (const key in summary) {
        const [month, year] = key.split("-");

        const line = document.createElement("p");
        line.textContent = `חודש ${month}/${year} — ${summary[key]} ₪`;

        summaryDiv.appendChild(line);
    }
}


function extractMonthYear(dateString) {
    if (dateString.includes("-")) {
        const [year, month, day] = dateString.split("-");
        return { month, year };
    }

    if (dateString.includes(".")) {
        const [day, month, year] = dateString.split(".");
        return { month, year };
    }
}


deleteAllBtn.addEventListener("click", () => {
            cardList = [];
            localStorage.setItem("cards", JSON.stringify(cardList));
            renderCards(currentFilter);   
        });

addBtn.addEventListener("click" , () => {
    const expendValue = inputExpend.value.trim();
    const amountValue = inputAmount.value.trim();
    const categoryValue = inputCategory.value.trim();
    const dateValue = inputDate.value || new Date().toLocaleDateString('he-IL'); 

    if(expendValue === "" || amountValue === "" || categoryValue === "" || dateValue === ""){
        return alert('אנא מלא את כל השדות');
    }

    const newCard = {
    id: crypto.randomUUID(),
    expend: expendValue,
    amount: amountValue,
    category: categoryValue,
    date: dateValue
};


    cardList.push(newCard);
    localStorage.setItem("cards", JSON.stringify(cardList));
    renderCards(currentFilter);

    inputExpend.value = "";
    inputAmount.value = "";
    inputCategory.value = "";
    inputDate.value = "";
});
