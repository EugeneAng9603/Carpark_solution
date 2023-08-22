import React, { useEffect, useState } from "react";

const BASE_URL = "https://api.data.gov.sg/v1/transport/carpark-availability";

const Carpark = () => {
  const [info, setInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setInfo(data.items[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    })();

    // Return a cleanup function for when the component unmounts
    return () => {
      console.log("Component will unmount");
    };
  }, []);

  if (isLoading) return <h1>Loading</h1>;

  let smallHighest, mediumHighest, bigHighest, largeHighest;
  smallHighest = mediumHighest = bigHighest = largeHighest = -Infinity;
  let smallLowest, mediumLowest, bigLowest, largeLowest;
  smallLowest = mediumLowest = bigLowest = largeLowest = Infinity;

  let largeMap = {};
  let bigMap = {};
  let mediumMap = {};
  let smallMap = {};

  let totalLots = [];
  let lotsAvailable = [];

  let { carpark_data } = info;
  // carpark_data is an array with 2000 {carpark_info:[], carpark_number, update_datetime}
  for (let i = 0; i < carpark_data?.length; i++) {
    let currObj = carpark_data[i];
    // currObj has multiple key values
    let carpark_number = currObj.carpark_number;
    let carpark_info = currObj.carpark_info; //an array

    for (let j = 0; j < carpark_info.length; j++) {
      let { total_lots, lots_available } = carpark_info[j];
      if (totalLots[i] === undefined) {
        totalLots[i] = parseInt(total_lots);
      } else {
        totalLots[i] += parseInt(total_lots);
      }

      if (lotsAvailable[i] === undefined) {
        lotsAvailable[i] = parseInt(lots_available);
      } else {
        lotsAvailable[i] += parseInt(lots_available);
      }
    }
    updateLotsAvailable(totalLots[i], lotsAvailable[i], carpark_number);
  }

  function updateLotsAvailable(total, available, carpark_number) {
    if (total >= 400) {
      if (!largeMap[available]) {
        largeMap[available] = [];
      }
      largeMap[available].push(carpark_number);

      largeHighest = Math.max(largeHighest, available);
      largeLowest = Math.min(largeLowest, available);
    } else if (total >= 300) {
      if (!bigMap[available]) {
        bigMap[available] = [];
      }
      bigMap[available].push(carpark_number);

      bigHighest = Math.max(bigHighest, available);
      bigLowest = Math.min(bigLowest, available);
    } else if (total >= 100) {
      if (!mediumMap[available]) {
        mediumMap[available] = [];
      }
      mediumMap[available].push(carpark_number);

      mediumHighest = Math.max(mediumHighest, available);
      mediumLowest = Math.min(mediumLowest, available);
    } else {
      if (!smallMap[available]) {
        smallMap[available] = [];
      }
      smallMap[available].push(carpark_number);

      smallHighest = Math.max(smallHighest, available);
      smallLowest = Math.min(smallLowest, available);
    }
  }

  return (
    <>
      <ul>
        <li>
          largeHighest: {largeMap[largeHighest]?.toString()}, lots available:{" "}
          {largeHighest}{" "}
        </li>
        <li>
          largeLowest: {largeMap[largeLowest]?.toString()}, lots available:{" "}
          {largeLowest}
        </li>
        <li>
          bigHighest: {bigMap[bigHighest]?.toString()}, lots available:{" "}
          {bigHighest}
        </li>
        <li>
          bigLowest: {bigMap[bigLowest]?.toString()}, lots available:{" "}
          {bigLowest}
        </li>
        <li>
          mediumHighest: {mediumMap[mediumHighest]?.toString()}, lots available:{" "}
          {mediumHighest}
        </li>
        <li>
          mediumLowest: {mediumMap[mediumLowest]?.toString()}, lots available:{" "}
          {mediumLowest}
        </li>
        <li>
          smallHighest: {smallMap[smallHighest]?.toString()}, lots available:{" "}
          {smallHighest}
        </li>
        <li>
          smallLowest: {smallMap[smallLowest]?.toString()}, lots available:{" "}
          {smallLowest}
        </li>
        <pre>{JSON.stringify(info, null, 2)}</pre>

        {/* <li>largeHighest: , largeLowest: {largeLowest} </li>
      <li>bigHighest: {bigHighest}, bigLowest: {bigLowest} </li>
      <li>mediumHighest: {mediumHighest}, mediumLowest: {mediumLowest} </li>
      <li>smallHighest: {smallHighest}, smallLowest: {smallLowest} </li> */}
      </ul>
    </>
  );
};

export default Carpark;
