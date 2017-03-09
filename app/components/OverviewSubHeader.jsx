import React from 'react';

import Subheader from 'material-ui/Subheader';
import {deepOrange500} from 'material-ui/styles/colors';

let OverviewSubHeader = function statelessFunctionComponentClass(props) {
  let curTime = props.curTime;

  return (
      <Subheader style={{fontSize: '18px', color: deepOrange500}}>{curTime}</Subheader>
  );
};

export default  OverviewSubHeader;