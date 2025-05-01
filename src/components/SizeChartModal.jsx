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
            <tr><td>35</td><td>220</td><td>3</td><td>2.5</td><td>/</td></tr>
            <tr><td>36</td><td>230</td><td>4</td><td>3.5</td><td>35</td></tr>
            <tr><td>37</td><td>235</td><td>4.5</td><td>4</td><td>36</td></tr>
            <tr><td>38</td><td>240</td><td>5.5</td><td>5</td><td>37</td></tr>
            <tr><td>39</td><td>245</td><td>6.5</td><td>6</td><td>38</td></tr>
            <tr><td>40</td><td>250</td><td>7</td><td>6</td><td>39</td></tr>
            <tr><td>41</td><td>260</td><td>8</td><td>7</td><td>40</td></tr>
            <tr><td>42</td><td>265</td><td>8.5</td><td>7.5</td><td>41</td></tr>
            <tr><td>43</td><td>275</td><td>9.5</td><td>8.5</td><td>42</td></tr>
            <tr><td>44</td><td>280</td><td>10</td><td>9</td><td>43</td></tr>
            <tr><td>45</td><td>290</td><td>11</td><td>10</td><td>44</td></tr>
            <tr><td>46</td><td>300</td><td>12</td><td>11</td><td>45</td></tr>
            <tr><td>47</td><td>305</td><td>12.5</td><td>11.5</td><td>/</td></tr>
            <tr><td>48</td><td>315</td><td>13.5</td><td>12.5</td><td>47</td></tr>
            <tr><td>49</td><td>325</td><td>14.5</td><td>13.5</td><td>/</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeChartModal;