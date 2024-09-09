import React from "react";
import './Dashboard.css';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar, Legend, } from 'recharts';
import { curveCardinal } from 'd3-shape';


const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const data2 = [
  {
    name: 'Doing Meeting',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Today',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
];

const data3 = [
  {
    name: 'Events',
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: 'Today',
    uv: 868,
    pv: 967,
    amt: 1506,
  },
];
const cardinal = curveCardinal.tension(0.2);


const COLORS = ['#8c65ff', '#f6e571', '#ff98ce', '#c495ff'];

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
      <div className="mainContainerDash">
        <div className="bloc1">
          <div className="d1">
            <p className="titleDash">Customers Overview</p>
            <p className="subtitleDash">When a customers have joined in the time.</p>
            <ResponsiveContainer width="90%" height="70%">
              <AreaChart
                width={400}
                height={300}
                data={data2}
                margin={{
                  top: 30,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type={cardinal} dataKey="uv" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="d2">
            <p className="titleDash">Events</p>
            <p className="subtitleDash">Our events and their status.</p>
            <ResponsiveContainer>
              <ComposedChart
                width={300}
                height={50}
                data={data3}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 70,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bloc2">
          <div className="d3">
            <p className="titleDash">Customers by Country</p>
          </div>
          <div className="d4">
            <p className="titleDash">Meetings top sources</p>
            <PieChart width={500} height={500}>
              <Pie
                data={data}
                cx={350}
                cy={150}
                innerRadius={50}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;