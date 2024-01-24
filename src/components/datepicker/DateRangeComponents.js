// DateRangeComponents.js
import { Button } from "@mui/material";
import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function DateRangeComponents({ handleDatePicker, handleDatePicked }) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  return (
    <>
      <DateRange
        editableDateInputs
        onChange={(item) => handleDatePicker([item.selection]) || setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
      />
      <Button onClick={() => {handleDatePicked(state[0])}}>Áp dụng</Button>
    </>
  );
};

