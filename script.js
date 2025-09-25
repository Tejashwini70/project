const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const listEl = document.getElementById("list");
const addBtn = document.getElementById("addBtn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateValues() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  balanceEl.textContent = `$${balance}`;
  incomeEl.textContent = `$${income}`;
  expensesEl.textContent = `$${expenses}`;

  updateChart();
}

function addTransaction(desc, amount, type) {
  const transaction = {
    id: Date.now(),
    desc,
    amount,
    type
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateValues();
}

function renderTransactions() {
  listEl.innerHTML = "";
  transactions.forEach(t => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.desc} <span>$${t.amount}</span>
      <button onclick="removeTransaction(${t.id})">X</button>
    `;
    listEl.appendChild(li);
  });
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateValues();
}

addBtn.addEventListener("click", () => {
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (desc && amount) {
    addTransaction(desc, amount, type);
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
  } else {
    alert("Please enter valid details!");
  }
});

// ----- Chart -----
let chart;
function updateChart() {
  const expenseData = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      expenseData[t.desc] = (expenseData[t.desc] || 0) + t.amount;
    });

  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(expenseData),
      datasets: [
        {
          data: Object.values(expenseData),
          backgroundColor: ["#f44336", "#ff9800", "#2196f3", "#9c27b0", "#4caf50"]
        }
      ]
    }
  });
}

// Init
renderTransactions();
updateValues();
