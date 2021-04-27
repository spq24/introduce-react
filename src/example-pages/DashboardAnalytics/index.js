import React, { useEffect, useState } from 'react';
import { useAuthState } from 'context'
import axios from 'axios';
import { PageTitle } from 'layout-components';
import DashboardAnalytics1 from '../../example-components/DashboardAnalytics/DashboardAnalytics1';
import DashboardAnalytics2 from '../../example-components/DashboardAnalytics/DashboardAnalytics2';
import DashboardAnalytics3 from '../../example-components/DashboardAnalytics/DashboardAnalytics3';
import DashboardAnalytics4 from '../../example-components/DashboardAnalytics/DashboardAnalytics4';
import DashboardAnalytics5 from '../../example-components/DashboardAnalytics/DashboardAnalytics5';
import DashboardAnalytics6 from '../../example-components/DashboardAnalytics/DashboardAnalytics6';

export default function DashboardAnalytics() {
  const userDetails = useAuthState();


  useEffect(() => {
    axios.get('/api/v1/dashboard', {
      headers: userDetails.credentials
    })
    .then(response => {
      console.log('response', response)
    })
  }, [])


  return (
    <>
      <PageTitle
        titleHeading="Analytics"
        titleDescription="Packed with hundreds of elements, you can build almost any dashboard."
      />

      <DashboardAnalytics1 />
      <DashboardAnalytics2 />
      <DashboardAnalytics3 />
      <DashboardAnalytics4 />
      <DashboardAnalytics5 />
      <DashboardAnalytics6 />
    </>
  );
}
