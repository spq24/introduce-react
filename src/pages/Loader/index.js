import React from 'react';
import { ScaleLoader } from 'react-spinners';

export default function Loader() {
  return (

    <div
      className="d-flex align-items-center justify-content-center"
      style={{ width: '150px', height: '80px' }}>
      <ScaleLoader color={'var(--primary)'} loading={true} />
    </div>
  )
}