const School = artifacts.require("School");

contract("School", (accounts) => {
  let schoolInstance;

  before(async () => {
    schoolInstance = await School.deployed();
  });

  it("should deploy the contract properly", async () => {
    assert(schoolInstance.address !== "");
  });

  it("should add a new student", async () => {
    await schoolInstance.addStudent("Alice", "A", { from: accounts[0] });
    const student = await schoolInstance.students(1);
    
    assert.equal(student.id.toNumber(), 1, "Student ID should be 1");
    assert.equal(student.name, "Alice", "Student name should be Alice");
    assert.equal(student.grade, "A", "Student grade should be A");
  });

  it("should update an existing student", async () => {
    await schoolInstance.updateStudent(1, "Alice Updated", "A+", { from: accounts[0] });
    const student = await schoolInstance.students(1);
    
    assert.equal(student.name, "Alice Updated", "Student name should be updated to Alice Updated");
    assert.equal(student.grade, "A+", "Student grade should be updated to A+");
  });

  it("should get the student details", async () => {
    const student = await schoolInstance.getStudent(1);
    
    assert.equal(student[0].toNumber(), 1, "Student ID should be 1");
    assert.equal(student[1], "Alice Updated", "Student name should be Alice Updated");
    assert.equal(student[2], "A+", "Student grade should be A+");
  });

  it("should delete a student", async () => {
    await schoolInstance.deleteStudent(1, { from: accounts[0] });
    const deletedStudent = await schoolInstance.students(1);
    
    assert.equal(deletedStudent.name, "", "Student should be deleted");
  });

  it("should fail when trying to update a non-existent student", async () => {
    try {
      await schoolInstance.updateStudent(999, "Non-existent", "F", { from: accounts[0] });
      assert.fail("The function should throw an error for non-existent student");
    } catch (error) {
      assert(error.message.includes("Student does not exist"), "Error message should contain 'Student does not exist'");
    }
  });
});
