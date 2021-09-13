import { storage, properties } from '@forge/api';
import ForgeUI, { render, Fragment, TextField, Text, Form, Button, ButtonSet, IssuePanel, Select, Option ,useEffect, useState, useProductContext } from '@forge/ui';
import axios from 'axios';


export const run = async ({ issue, transition: { from, to } }) => {
  //console.log(JSON.stringify(await storage.get(issue.key+'-jenkinsvalue')));
  //console.log(issue);
  var statusTo ='';
  const { fields: { status } } = await doGet(`/rest/api/3/issue/${issue.key}?fields=status`);
  //console.log(status);
  const issueResponse = await api.asApp().requestJira(`/rest/api/2/issue/${issue.key}`);
  //await checkResponse('Jira API', issueResponse);
  const statuses  = (await issueResponse.json());
  //console.log(statuses);
  const jiraissueType = statuses.fields.issuetype.name;
  const issuevariable = statuses.fields.project.key;
  const issueResponse1 = await api.asApp().requestJira(`/rest/api/2/project/${issuevariable}/statuses`);
  //await checkResponse('Jira API', issueResponse);
  const statuses1  = (await issueResponse1.json());
  //console.log(`${issue.key}-jenkinsvalue`);
  //console.log(statuses1);

  var jiraoption = [];
  for (var status1 in statuses1){
    //console.log(statuses[status]);
    //console.log(jiraissueType);
    //console.log(statuses1[status1].name);
    if(jiraissueType==statuses1[status1].name){
      var newobjStatus = statuses1[status1].statuses;
        //console.log(newobjStatus);
      for (var statusfnd  in newobjStatus ){
        //console.log(newobjStatus[statusfnd].id);
        if (newobjStatus[statusfnd].id == to.id){
          statusTo=newobjStatus[statusfnd].name;
          console.log(statuses);

          var jenkinsUname = statuses.fields.customfield_10039;
          var jenkinspassword = statuses.fields.customfield_10040;
          var jenkinsjob = statuses.fields.customfield_10041;
            var jenkinsURL = statuses.fields.customfield_10038+'/job/'+jenkinsjob+'/build';
            var btoa = require('btoa');
            var bin = jenkinsUname+":"+jenkinspassword;
            var b64 = btoa(bin);

          var config = {
            method: 'post',
            url: jenkinsURL,
            headers: {
              'Authorization': 'Basic '+ b64,
              'Content-Type': 'text/plain',
            }
          };


          console.log(jenkinsURL);
          console.log(jenkinsUname);
          console.log(jenkinspassword);

          await axios(config)
          .then(async function (response) {
            console.log(response);
              //const response = await addjirastatus(jiraissueid, jenkinsvalue.URL);

          })
          .catch(function (error) {
            console.log(error);
            //setjenkinsfound(false);
          });



        }
      }
      //console.log(newobjStatus);
    }
  }
  console.log('starting');






  //console.log(from);
  //console.log(to);
  //console.log(statusTo);

  //var jenkinsvalue = await properties.onJiraIssue(`${issue.key}`).set('jenkinsvalue','value')
  return {
    result: true
  }
};


async function doGet(apiPath) {
  const response = await api.asApp().requestJira(apiPath);
  if (!response.ok) {
    const message = `Error invoking ${apiPath}: ${response.status} ${await response.text()}`;
    console.error(message);
    throw new Error(message);
  }
  const responseBody = await response.json();
  if (process.env.DEBUG_LOGGING) {
    console.debug(`GET ${apiPath}: ${JSON.stringify(responseBody)}`);
  }
  return responseBody;
}
