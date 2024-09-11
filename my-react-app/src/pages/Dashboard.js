import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import EventMap from './DashboardMap'; // Ensure this component is created to render the map

import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const COLORS = [
  '#8c65ff', '#f6e571', '#ff98ce', '#c495ff',
  '#ff6f61', '#6b5b95', '#d3a625', '#f7cac9',
  '#92a8d1', '#034f84', '#c2c2f0', '#ffb3e6',
  '#ff6666', '#c2f0c2', '#f0f0f0', '#e3baff',
  '#c4e17f', '#f4b942', '#ff6f61', '#b9a4e8'
];

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = Cookies.get('isLoggedIn');
  const urlDB = process.env.REACT_APP_DB_URL;

  // Redirect if user is not logged in
  if (!isLoggedIn) {
    navigate('/login');
  }

  useEffect(() => {
    fetch(`${urlDB}/api/events`)
      .then(response => response.json())
      .then(data => {
        setEvents(data.data);
        console.log('Fetched events:', data.data);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  useEffect(() => {
    fetch(`${urlDB}/api/customers`)
      .then(response => response.json())
      .then(data => {
        setCustomers(data.data);
        console.log('Fetched customers:', data.data);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  useEffect(() => {
    fetch(`${urlDB}/api/encounters`)
      .then(response => response.json())
      .then(data => {
        setEncounters(data.data);
        console.log('Fetched encounters:', data.data);
        // Count encounter sources
        const sourceCount = {};
        data.data.forEach(encounter => {
          const source = encounter.source;
          if (source) {
            sourceCount[source] = (sourceCount[source] || 0) + 1;
          }
        });

        // Prepare data for pie chart
        const sourceData = Object.keys(sourceCount).map(source => ({
          name: source,
          value: sourceCount[source],
        }));

        // Update state with pie chart data
        setSourceData(sourceData);
      })
      .catch(error => console.error('Error fetching encounters:', error));
  }, []);

  // Initialize data for events by month
  const dataEvents = [
    { name: 'January', value: 0 },
    { name: 'February', value: 0 },
    { name: 'March', value: 0 },
    { name: 'April', value: 0 },
    { name: 'May', value: 0 },
    { name: 'June', value: 0 },
    { name: 'July', value: 0 },
    { name: 'August', value: 0 },
    { name: 'September', value: 0 },
    { name: 'October', value: 0 },
    { name: 'November', value: 0 },
    { name: 'December', value: 0 },
  ];

  // Count events by month
  events.forEach(event => {
    const date = new Date(event.date);
    const month = date.getMonth();
    dataEvents[month].value += 1;
  });

  // Count astrological signs
  const astrologicalSignCount = {};
  customers.forEach(customer => {
    const sign = customer.astrological_sign;
    if (sign) {
      astrologicalSignCount[sign] = (astrologicalSignCount[sign] || 0) + 1;
    }
  });

  // Prepare data for astrological sign bar chart
  const astrologicalSignData = Object.keys(astrologicalSignCount).map(sign => ({
    name: sign,
    value: astrologicalSignCount[sign],
  }));

  return (
    <div>
      <div className='top-bar'>
        <h1>Dashboard</h1>
      </div>
      <p className='subtitleCustom'>Welcome!</p>
      <div className="mainContainerDash">
        <div className="bloc1">
          <div className="d1">
            <p className="titleDash">Event Distribution in France</p>
            <p className="subtitleDash">Event locations based on regions in France.</p>
            <EventMap events={events} />
          </div>
          <div className="d2">
            <p className="titleDash">Events by Month</p>
            <p className="subtitleDash">Number of events occurring each month.</p>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={dataEvents}
                margin={{
                  top: 50,
                  right: 70,
                  bottom: 20,
                  left: 0,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end"/>
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bloc2">
          <div className="d3">
            <p className="titleDash">Customers by Astrological Sign</p>
            <p className="subtitleDash">Distribution of customers based on their astrological signs.</p>
            <ResponsiveContainer width="90%" height={270}>
              <BarChart data={astrologicalSignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="d4">
            <p className="titleDash">Meetings Top Sources</p>
            <p className="subtitleDash">Distribution of meeting sources.</p>
            <div className="centerGraphContainer">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%" // Center horizontally
                    cy="50%" // Center vertically
                    innerRadius={40}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
