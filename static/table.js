document.addEventListener("DOMContentLoaded", () => {
    const tableForm = document.querySelector(".table"); // form

    // elements that are used to create the statement
    const statementCreator = document.querySelector(".statement");
    const varButtons = document.querySelector(".selected-vars");
    const statementInput = document.querySelector(".statement-input");

    // this will be used to hold the statement, which will push values clicked onto it, and
    // hitting back button will allow the previous items to be removed from the statement
    const backButton = document.querySelector(".back-btn");
    let statementStack = [];
    let statementVars = [];
    let finalStatementValues = "";

    tableForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(tableForm);
        for (var value of formData.values()) {
            if (value) {
                varButtons.innerHTML += `<button class="ui var-btn button">${value}</button>`;
                statementVars.push(value);
            }
        }

        const varButtonValues = document.querySelectorAll(".var-btn");
        varButtonValues.forEach(btn => {
            btn.addEventListener("click", () => {
                console.log(btn.innerText);
                statementStack.push(btn.innerText);
                setStatementInput();
            });
        });

        // add event listener to back button to pop last item from stack
        backButton.addEventListener("click", () => {
            if (statementStack.length > 0) {
                statementStack.pop();
            }
            setStatementInput();
        });

        // make the statement creator element visible
        statementCreator.style.display = "block";
    });

    // updates the text input of statement
    function setStatementInput() {
        statementInput.value = statementStack.join(" ");
        console.log(JSON.stringify({ statements: finalStatementValues }));
    }

    // get table that will show truth values
    const truthTable = document.querySelector(".truth-table");
    const truthHeaders = document.querySelector(".truth-headers");
    const createTable = document.querySelector(".create-table");

    createTable.addEventListener("click", () => {
        // clear previous table
        truthHeaders.innerHTML = "";
        truthTable.innerHTML = "";
        // get form data
        const formData = new FormData(tableForm);
        const input_1 = formData.get("input_1");
        const input_2 = formData.get("input_2");

        // push the final statement onto the values to be sent/ convert to JSON
        finalStatementValues = statementStack.join(" ").toLocaleLowerCase();
        // push the finished statement to others before to prevent returning an int
        //statementVars.push(finalStatementValues);
        const statementJSON = {
            createdStatement: finalStatementValues,
            statementVars: statementVars
        };

        fetch("/table", {
            body: JSON.stringify(statementJSON),
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                // first append headers to table
                // for(var pair of formData.entries()) { // try this later forEach for all form values
                //     console.log(pair[0]+ ', '+ pair[1]);
                //  }

                // set table headers
                statementVars.forEach(value => {
                    truthHeaders.innerHTML += `<th>${value}</th>`;
                });
                // append the final statement last to headers
                truthHeaders.innerHTML += `<th>${finalStatementValues}</th>`;

                // append the truth value data to the table
                data.table.forEach(row => {
                    let tableRow = `<tr>`;
                    row.forEach(col => {
                        tableRow += `<td>${col}</td>`;
                        console.log(`Col val: ${col}`);
                    });

                    tableRow += `</tr>`;
                    console.log(`Table Row: ${tableRow}`);
                    truthTable.innerHTML += tableRow;
                });
                console.log(data);
            })
            .catch(err => {
                truthTable.innerHTML = `<h1>Error creating table</h1>`;
            });
    });
});
