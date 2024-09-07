let web3;
let schoolContract;
let contractAddress = '0x0ED1A556d86072F2fd14eF210E2b95aE794865D6';
let contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "grade",
          "type": "string"
        }
      ],
      "name": "StudentAdded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "studentCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "students",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "grade",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_grade",
          "type": "string"
        }
      ],
      "name": "addStudent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_grade",
          "type": "string"
        }
      ],
      "name": "updateStudent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "deleteStudent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getStudent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]
;

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    } else {
        alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    schoolContract = new web3.eth.Contract(contractABI, contractAddress);
    await loadStudents();
}

a// Load the list of students
async function loadStudents() {
    const studentCount = await schoolContract.methods.studentCount().call();
    const studentList = document.getElementById('studentList');
    
    // Clear the list before adding new items
    studentList.innerHTML = '';

    for (let i = 1; i <= studentCount; i++) {
        const student = await schoolContract.methods.students(i).call();
        const li = document.createElement('li');
        li.innerHTML = `ID: ${student.id}, Name: ${student.name}, Grade: ${student.grade}`;
        studentList.appendChild(li);
    }
}

async function addStudent() {
    try {
        const name = document.getElementById('studentName').value;
        const grade = document.getElementById('studentGrade').value;
        const accounts = await web3.eth.getAccounts();
        
        // Manually specify the gas price since EIP-1559 is not supported
        const gasPrice = await web3.eth.getGasPrice(); // Get the current gas price
        
        await schoolContract.methods.addStudent(name, grade).send({ 
            from: accounts[0], 
            gas: 3000000,  // You can adjust the gas limit based on your contract's needs
            gasPrice: gasPrice  // Manually set the gas price
        });
        
        console.log('Student added successfully');
        await loadStudents(); // Reload students list after successful transaction
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

// Update student data
async function updateStudent() {
  try {
      const id = document.getElementById('studentIdUpdate').value;
      const name = document.getElementById('updateName').value;
      const grade = document.getElementById('updateGrade').value;
      const accounts = await web3.eth.getAccounts();
      const gasPrice = await web3.eth.getGasPrice();

      await schoolContract.methods.updateStudent(id, name, grade).send({
          from: accounts[0],
          gas: 3000000,
          gasPrice: gasPrice
      });

      console.log('Student updated successfully');
      await loadStudents(); // Reload the updated list
  } catch (error) {
      console.error('Transaction failed:', error);
  }
}

// Delete a student
async function deleteStudent() {
  try {
      const id = document.getElementById('studentIdDelete').value;
      const accounts = await web3.eth.getAccounts();
      const gasPrice = await web3.eth.getGasPrice();

      await schoolContract.methods.deleteStudent(id).send({
          from: accounts[0],
          gas: 3000000,
          gasPrice: gasPrice
      });

      console.log('Student deleted successfully');
      await loadStudents(); // Reload the updated list
  } catch (error) {
      console.error('Transaction failed:', error);
  }
}

window.addEventListener('load', async () => {
    await initWeb3();
});
