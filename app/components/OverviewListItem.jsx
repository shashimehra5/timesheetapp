import React from 'react';

import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';

let OverviewListItem = function statelessFunctionComponentClass(props) {
  let jobName = props.jobName;
  let jobTime = props.jobTime;

  return (
      <ListItem leftAvatar={<Avatar icon={<ActionAssignment />} />} 
                primaryText={jobName}
                secondaryText={jobTime+' hour'} />
  );
};

export default OverviewListItem;