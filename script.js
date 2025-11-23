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

function renderCards(filter = "all") { 
    cards.innerHTML = "";
    cardList.forEach((cardData, index) => {
        if (filter !== "all" && cardData.category !== filter) return;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>תיאור הוצאה: ${cardData.expend}</h3>
            <h3>סכום הוצאה: ${cardData.amount}</h3>
            <h3>קטגוריה: ${cardData.category}</h3>
            <h3>תאריך: ${cardData.date}</h3>
            <button class="deleteBtn">מחק</button>
        `;

        card.querySelector(".deleteBtn").addEventListener("click", () => {
            cardList.splice(index, 1);
            localStorage.setItem("cards", JSON.stringify(cardList));
            renderCards(currentFilter);   
        });

        cards.appendChild(card);
    });
    updateSummary();
}

function updateSummary() {
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = "<h2>סיכום חודשי:</h2>";

    const summary = {}; // סכומים לכל חודש-שנה

    cardList.forEach(card => {
        const { month, year } = extractMonthYear(card.date);
        const key = `${month}-${year}`;  // לדוגמה: "11-2025"

        if (!summary[key]) summary[key] = 0;
        summary[key] += Number(card.amount);
    });

    for (const key in summary) {
        const [month, year] = key.split("-");
        summaryDiv.innerHTML += `
            <p>חודש ${month}/${year} — ${summary[key]} ₪</p>
        `;
    }
}


function extractMonthYear(dateString) {
    // אם זה תאריך פורמט HTML: YYYY-MM-DD
    if (dateString.includes("-")) {
        const [year, month, day] = dateString.split("-");
        return { month, year };
    }

    // אם זה פורמט מקומי כמו 23.11.2025
    if (dateString.includes(".")) {
        const [day, month, year] = dateString.split(".");
        return { month, year };
    }

    // פורמט לא מזוהה – לא יקרה, אבל ליתר ביטחון
    return { month: "??", year: "??" };
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
