import React, { useEffect, useState } from "react";

const BASE_URL = "https://api.data.gov.sg/v1/transport/carpark-availability";

const Carpark = () => {
  const [info, setInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // polling, refresh new data every 60 seconds
      setTimer(Date.now());
    }, 60 * 1000);

    // call API and update state
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

    return () => {
      console.log("Component Unmounted.");
      clearInterval(interval);
    };
  }, [timer]);

  if (isLoading) return <h1>Loading...Please wait a moment...</h1>;

  // logic to find the highest, lowest available lots in every category
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
  for (let i = 0; i < carpark_data?.length; i++) {
    let currObj = carpark_data[i];

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
      </ul>
    </>
  );
};

export default Carpark;
