// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract School {
    struct Student {
        uint id;
        string name;
        string grade;
    }

    mapping(uint => Student) public students;
    uint public studentCount;

    // Event to log student creation
    event StudentAdded(uint id, string name, string grade);

    // Add a new student
    function addStudent(string memory _name, string memory _grade) public {
        studentCount++;
        students[studentCount] = Student(studentCount, _name, _grade);
        emit StudentAdded(studentCount, _name, _grade);
    }

    // Update an existing student
    function updateStudent(uint _id, string memory _name, string memory _grade) public {
        require(_id <= studentCount, "Student does not exist.");
        students[_id].name = _name;
        students[_id].grade = _grade;
    }

    // Delete a student
    function deleteStudent(uint _id) public {
        require(_id <= studentCount, "Student does not exist.");
        delete students[_id];
    }

    // Get student details
    function getStudent(uint _id) public view returns (uint, string memory, string memory) {
        Student memory s = students[_id];
        return (s.id, s.name, s.grade);
    }
}
