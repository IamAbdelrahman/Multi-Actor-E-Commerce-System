/******************************************************************************
 * Copyright (C) 2024 by Abdelrahman Kamal - Admin Panel Page
 *****************************************************************************/

/*****************************************************************************
 * FILE DESCRIPTION
 * ----------------------------------------------------------------------------
 *	@file admin.js
 *	@brief This module contains all functionalities about the admin.
 *
 *	@details Single Admin account with a predefined email & password.
    Can block or activate customers and sellers.
    Has the exclusive ability to add new sellers.
    Can add, edit, or remove any product.
    Access to a dashboard displaying:
    Number of customers
    Sales statistics
    Other key metrics
    Can purchase products like a regular customer.
 *****************************************************************************/

/*- INCLUDES
-----------------------------------------------------------------------*/
import StorageManager from '../modules/StorageModule.js'
import UserManager from '../modules/UserModule.js'

/*- SIDEBAR TOGGLER
-----------------------------------------------------------------------*/
new Chart(document.getElementById("bar-chart-grouped"), {
  type: 'bar',
  data: {
    labels: ["1900", "1950", "1999", "2050"],
    datasets: [
      {
        label: "Africa",
        backgroundColor: "#3e95cd",
        data: [133,221,783,2478]
      }, {
        label: "Europe",
        backgroundColor: "#8e5ea2",
        data: [408,547,675,734]
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Population growth (millions)'
    }
  }
});

/*- ADMIN DASHBOARD
-----------------------------------------------------------------------*/
// Simulated data (replace with real data from localStorage/API)
const dashboardData = {
  revenue: 89189,
  revenueChange: 9.0,
  visitors: 5243,
  visitorsChange: 12.5,
  orders: 1287,
  ordersChange: 5.3
};

// Animate numbers counting up
function animateValue(id, target, duration = 2000) {
  const element = document.getElementById(id);
  const start = 0;
  const increment = target / (duration / 16); // 60fps

  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(timer);
      current = target;
    }
    element.textContent = 
      id === "revenue" ? `$${Math.floor(current).toLocaleString()}` 
      : Math.floor(current).toLocaleString();
  }, 16);
}

// Update all cards on page load
window.addEventListener('load', () => {
  // Animate numbers
  animateValue("revenue", dashboardData.revenue);
  animateValue("visitors", dashboardData.visitors);
  animateValue("orders", dashboardData.orders);

  // Update percentage changes
  document.getElementById("revenue-change").textContent = 
    `+${dashboardData.revenueChange}% Since Last Month`;
  document.getElementById("visitors-change").textContent = 
    `+${dashboardData.visitorsChange}% Since Last Month`;
  document.getElementById("orders-change").textContent = 
    `+${dashboardData.ordersChange}% Since Last Month`;
});

    UserManager.DeleteUser(id);
  });
  return icon;
}



  const toggleBtn = document.querySelector(".toggle-btn");
  const toggler = document.querySelector("#icon");
  toggleBtn.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
  toggler.classList.toggle("bxs-chevrons-right");
  toggler.classList.toggle("bxs-chevrons-left");
  });
