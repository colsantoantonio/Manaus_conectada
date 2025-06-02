// ProducingRoute.js
import React from 'react';
import EmProducao from './indexPro';

const ProducingRoute = ({ children, ativo }) => {
  if (ativo) {
    return <EmProducao />;
  }
  return children;
};

export default ProducingRoute;
