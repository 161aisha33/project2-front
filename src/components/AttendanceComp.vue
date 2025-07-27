<template>
  <div class="attendance-system">
    <h1>Employee Attendance System</h1>

    <!-- Employee Search Dropdown -->
    <div class="search-box">
      <select v-model="selectedEmployeeId" @change="selectEmployeeById" class="search-input">
        <option value="">Select employee...</option>
        <option v-for="emp in employees" :key="emp.employeeId" :value="emp.employeeId">
          {{ emp.name }}
        </option>
      </select>
    </div>

    <!-- Selected Employee Form -->
    <div v-if="selectedEmployee" class="employee-form">
      <h2>{{ selectedEmployee.name }}</h2>

      <!-- Attendance Records -->
      <div class="form-section">
        <h3>Attendance Records</h3>
        <table class="records-table" v-if="selectedEmployee.attendance.length > 0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in selectedEmployee.attendance" :key="index">
              <td>
                <input type="date" v-model="record.date" class="form-control" />
              </td>
              <td>
                <select v-model="record.status" class="form-control">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No attendance records.</p>
      </div>

      <!-- Leave Requests -->
      <div class="form-section">
        <h3>Leave Requests</h3>
        <table class="records-table" v-if="selectedEmployee.leaveRequests.length > 0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in selectedEmployee.leaveRequests" :key="index">
              <td>
                <input type="date" v-model="request.date" class="form-control" />
              </td>
              <td>
                <select v-model="request.reason" class="form-control">
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Personal">Personal</option>
                  <option value="Family Responsibility">Family Responsibility</option>
                  <option value="Medical Appointment">Medical Appointment</option>
                  <option value="Bereavement">Bereavement</option>
                  <option value="Childcare">Childcare</option>
                </select>
              </td>
              <td>
                <select v-model="request.status" class="form-control">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Denied">Denied</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No leave requests.</p>
      </div>

      <button @click="saveChanges" class="btn btn-success">Save Changes</button>
      <button @click="cancelEdit" class="btn btn-secondary" style="margin-left:10px;">Cancel</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'AttendanceComp',
  props: {
    employees: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedEmployee: null,
      selectedEmployeeId: ''
    }
  },
  methods: {
    async selectEmployee(employee) {
      const clone = JSON.parse(JSON.stringify(employee));
      try {
        const attendanceRes = await axios.get(`http://localhost:9090/attendance/${employee.employeeId}`);
        clone.attendance = attendanceRes.data;
      } catch (error) {
        clone.attendance = [];
        console.error("Failed to fetch attendance:", error);
      }
      try {
        const leaveRes = await axios.get(`http://localhost:9090/leave/${employee.employeeId}`);
        clone.leaveRequests = leaveRes.data;
      } catch (error) {
        clone.leaveRequests = [];
        console.error("Failed to fetch leave requests:", error);
      }
      if (!Array.isArray(clone.leaveRequests)) clone.leaveRequests = [];
      this.selectedEmployee = clone;
    },

    selectEmployeeById() {
      const emp = this.employees.find(e => e.employeeId == this.selectedEmployeeId);
      if (emp) {
        this.selectEmployee(emp);
      }
    },

    async saveChanges() {
      try {
        await axios.put(`http://localhost:9090/attendance/${this.selectedEmployee.employeeId}`, this.selectedEmployee.attendance);
        await axios.put(`http://localhost:9090/leave/${this.selectedEmployee.employeeId}`, this.selectedEmployee.leaveRequests);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Failed to save changes:", error);
        alert("Failed to save changes.");
      }
    },

    cancelEdit() {
      this.selectedEmployee = null;
      this.selectedEmployeeId = '';
    }
  }
}
</script>

<style scoped>
.attendance-system {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2vw;
}
.search-box {
  margin-bottom: 20px;
}
.search-input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #2199ea;
  border-radius: 4px;
  font-size: 1rem;
}
.employee-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}
.form-section {
  margin-bottom: 30px;
}
.records-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}
.records-table th, .records-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.records-table th {
  background-color: #f2f2f2;
}
.form-control {
  width: 100%;
  padding: 5px;
}
.btn {
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 3px;
  border: none;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-success {
  background-color: #28a745;
  color: white;
  padding: 8px 15px;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
