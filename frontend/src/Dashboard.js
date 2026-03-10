import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function Dashboard({logout}){

const [expenses,setExpenses] = useState([]);
const [title,setTitle] = useState("");
const [amount,setAmount] = useState("");
const [category,setCategory] = useState("Food");
const [date,setDate] = useState("");

const [editingExpense,setEditingExpense] = useState(null);
const [showPopup,setShowPopup] = useState(false);

const [dark,setDark] = useState(false);
const [page,setPage] = useState("expenses");

useEffect(()=>{
fetchExpenses();
},[])

const fetchExpenses = ()=>{
fetch("http://localhost:5000/expenses")
.then(res=>res.json())
.then(data=>setExpenses(data));
}

const addExpense = ()=>{

fetch("http://localhost:5000/expenses",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title,
amount,
category,
date
})
})
.then(()=>fetchExpenses())

}

const deleteExpense = (id)=>{

if(!window.confirm("Delete this expense?")) return;

fetch(`http://localhost:5000/expenses/${id}`,{
method:"DELETE"
})
.then(()=>fetchExpenses())

}

const openEditPopup = (expense)=>{

setEditingExpense(expense)

setTitle(expense.title)
setAmount(expense.amount)
setCategory(expense.category)
setDate(expense.date)

setShowPopup(true)

}

const updateExpense = ()=>{

fetch(`http://localhost:5000/expenses/${editingExpense.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
title,
amount,
category,
date
})
})
.then(()=>{
setShowPopup(false)
fetchExpenses()
})

}

const exportCSV = ()=>{

let csv = "Title,Amount,Category,Date\n"

expenses.forEach(e=>{
csv += `${e.title},${e.amount},${e.category},${e.date}\n`
})

const blob = new Blob([csv],{type:"text/csv"})
const url = window.URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = "expenses_report.csv"
a.click()

}

const total = expenses.reduce((a,b)=>a+Number(b.amount),0)

const highest = expenses.length>0
? Math.max(...expenses.map(e=>e.amount))
:0

const average = expenses.length>0
? Math.round(total/expenses.length)
:0

const months = {}
expenses.forEach(e=>{
const m = new Date(e.date).getMonth()+1
months[m] = (months[m] || 0) + Number(e.amount)
})

const chartData = {
labels:Object.keys(months),
datasets:[
{
label:"Monthly Expenses",
data:Object.values(months),
backgroundColor:"#4bc0c0"
}
]
}

return(

<div style={{display:"flex"}}>

<div style={{
width:"220px",
background:"linear-gradient(#2196f3,#26c6da)",
minHeight:"100vh",
color:"white",
padding:"20px"
}}>

<h3>Dashboard</h3>

<p style={{cursor:"pointer"}} onClick={()=>setPage("expenses")}>Expenses</p>
<p style={{cursor:"pointer"}} onClick={()=>setPage("analytics")}>Analytics</p>
<p style={{cursor:"pointer"}} onClick={()=>setPage("reports")}>Reports</p>

<button
className="btn btn-light mt-3"
onClick={()=>setDark(!dark)}
>
Toggle Dark Mode
</button>

<button
className="btn btn-danger mt-3"
onClick={logout}
>
Logout
</button>

</div>

<div style={{
flex:1,
padding:"30px",
background:dark ? "#222" : "#f4f6f9",
color:dark ? "white":"black"
}}>

<h2>Expense Tracker</h2>

<div style={{display:"flex",gap:"20px",marginTop:"20px"}}>

<div style={{
background:"#2e7d32",
color:"white",
padding:"20px",
borderRadius:"8px",
width:"250px"
}}>
<h5>Total Expenses</h5>
<h3>₹{total}</h3>
</div>

<div style={{
background:"#c62828",
color:"white",
padding:"20px",
borderRadius:"8px",
width:"250px"
}}>
<h5>Highest Expense</h5>
<h3>₹{highest}</h3>
</div>

<div style={{
background:"#f9a825",
color:"white",
padding:"20px",
borderRadius:"8px",
width:"250px"
}}>
<h5>Average Expense</h5>
<h3>₹{average}</h3>
</div>

</div>

{page==="expenses" &&(

<>

<div style={{marginTop:"20px",display:"flex",gap:"10px"}}>

<input
placeholder="Title"
className="form-control"
onChange={(e)=>setTitle(e.target.value)}
/>

<input
placeholder="Amount"
className="form-control"
onChange={(e)=>setAmount(e.target.value)}
/>

<select
className="form-control"
onChange={(e)=>setCategory(e.target.value)}
>
<option>Food</option>
<option>Travel</option>
<option>Shopping</option>
<option>Entertainment</option>
</select>

<input
type="date"
className="form-control"
onChange={(e)=>setDate(e.target.value)}
/>

<button
className="btn btn-primary"
onClick={addExpense}
>
Add Expense
</button>

<button
className="btn btn-success"
onClick={exportCSV}
>
Download CSV
</button>

</div>

<table className="table mt-4">

<thead>
<tr>
<th>Title</th>
<th>Amount</th>
<th>Category</th>
<th>Date</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{expenses.map(e=>(
<tr key={e.id}>

<td>{e.title}</td>
<td>₹{e.amount}</td>
<td>{e.category}</td>
<td>{new Date(e.date).toLocaleDateString()}</td>

<td>

<button
className="btn btn-warning btn-sm me-2"
onClick={()=>openEditPopup(e)}
>
Edit
</button>

<button
className="btn btn-danger btn-sm"
onClick={()=>deleteExpense(e.id)}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</>

)}

{page==="analytics" &&(

<div style={{marginTop:"40px"}}>

<h4>Monthly Expense Chart</h4>

<Bar data={chartData}/>

</div>

)}

{page==="reports" &&(

<div style={{marginTop:"40px"}}>

<h4>Expense Reports</h4>
<p>Total Transactions: {expenses.length}</p>
<p>Total Money Spent: ₹{total}</p>

</div>

)}

</div>

{showPopup && (

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"white",
padding:"30px",
borderRadius:"10px",
width:"400px"
}}>

<h3>Edit Expense</h3>

<input
className="form-control mb-2"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<input
className="form-control mb-2"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<select
className="form-control mb-2"
value={category}
onChange={(e)=>setCategory(e.target.value)}
>
<option>Food</option>
<option>Travel</option>
<option>Shopping</option>
<option>Entertainment</option>
</select>

<input
type="date"
className="form-control mb-3"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

<button
className="btn btn-success me-2"
onClick={updateExpense}
>
Update
</button>

<button
className="btn btn-secondary"
onClick={()=>setShowPopup(false)}
>
Cancel
</button>

</div>

</div>

)}

</div>

)

}

export default Dashboard;