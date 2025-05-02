import React from "react";
import "./SizeChartModal.css";

const SizeChartModal = ({ onClose }) => {
  return (
    <div className="size-chart-overlay">
      <div className="size-chart-modal">
        <button className="close-button" onClick={onClose}>✕ закрыть</button>
        <h2>Размерная сетка обуви</h2>
        <table className="size-chart-table">
          <thead>
            <tr>
              <th>EU</th>
              <th>MM</th>
              <th>US</th>
              <th>UK</th>
              <th>RU</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>40</td><td>250</td><td>7</td><td>6</td><td>39</td></tr>
            <tr><td>41</td><td>260</td><td>8</td><td>7</td><td>40</td></tr>
            <tr><td>42</td><td>265</td><td>8.5</td><td>7.5</td><td>41</td></tr>
            <tr><td>43</td><td>275</td><td>9.5</td><td>8.5</td><td>42</td></tr>
            <tr><td>44</td><td>280</td><td>10</td><td>9</td><td>43</td></tr>
            <tr><td>45</td><td>290</td><td>11</td><td>10</td><td>44</td></tr>
            <tr><td>46</td><td>300</td><td>12</td><td>11</td><td>45</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeChartModal;