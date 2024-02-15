import React, { useState } from 'react';

const StudentForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    age: initialData?.age || 21,
    major: initialData?.major || '',
    year: initialData?.year || 1,
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
    console.log(JSON.stringify(formData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formData");
    console.log(JSON.stringify(formData));
    onSubmit(formData);
  };

  return (
    <div>
      <h3>Add/Edit Student</h3>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />

        <label>Major:</label>
        <input
          type="text"
          name="major"
          value={formData.major}
          onChange={handleChange}
        />

        <label>Year:</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
