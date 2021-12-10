import React from 'react';

import { FeaturedInfo } from '../components/FeaturedInfo';
import Charts from '../components/Charts';
import Widgets from '../components/Widgets';

const adminPanel = () => {
  return (
    <>
      <FeaturedInfo />
      <Charts />
      <Widgets />
    </>
  );
};

export default adminPanel;
