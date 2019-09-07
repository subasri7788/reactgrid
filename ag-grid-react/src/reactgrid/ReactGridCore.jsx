import React, {Component} from "react";
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import NameCellEditor from './NameCellEditor.jsx';
import SortableHeaderComponent from './SortableHeaderComponent.jsx';

import "./ReactGridStyle.css";
import "ag-grid-enterprise";

export default class ReactGridCore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quickFilterText: null,
            sideBar: false,
            rowData: [],
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-times"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
                groupExpanded: '<i class="far fa-minus-square"/>',
                groupContracted: '<i class="far fa-plus-square"/>'
            }
        };
    }

    /* Grid Events we're listening to */
    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;
      this.callGet();
    };

    callGet() {
        const updateData = data => {
          this.rowData = data;
          this.setState({
              rowData:data 
          })

          var dataSource = {
            getRows: function(params) {
              setTimeout(function() {
                var response = getMockServerResponse(params.request);
                params.successCallback(response.rowsThisBlock, response.lastRow);
              }, 500);
            }
          };
          this.api.setServerSideDatasource(dataSource);
        };
        const httpRequest = new XMLHttpRequest();
        httpRequest.open(
            "GET",
            "https://jsonplaceholder.typicode.com/users"
          );
          httpRequest.send();
          httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                var jsonResponse=JSON.parse(httpRequest.responseText);
              console.log("calling"+jsonResponse);  
              updateData(jsonResponse);
            }
          }; 
    };
    onCellClicked = (event) => {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    };

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data.name);
    };

    /* Demo related methods */
    onToggleSidebar = (event) => {
        this.setState({sideBar: event.target.checked});
    };

    deselectAll() {
        this.api.deselectAll();
    }

    onQuickFilterText = (event) => {
        this.setState({quickFilterText: event.target.value});
    };

    onRefreshData = () => {
        this.callGet();
    };

    invokeSkillsFilterMethod = () => {
        let skillsFilter = this.api.getFilterInstance('skills');
        let componentInstance = skillsFilter.getFrameworkComponentInstance();
        componentInstance.helloFromSkillsFilter();
    };

    dobFilter = () => {
        let dateFilterComponent = this.api.getFilterInstance('dob');
        dateFilterComponent.setModel({
            type: 'equals',
            dateFrom: '2000-01-01'
        });

        // as the date filter is a React component, and its using setState internally, we need
        // to allow time for the state to be set (as setState is an async operation)
        // simply wait for the next tick
        setTimeout(() => {
            this.api.onFilterChanged();
        });
    };




    render() {
        return (
            <div style={{width: '900px'}}>
                <h1>React Grid App</h1>
                
                <div style={{marginTop: 10}}>
                   
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}>
                        <div style={{float: "left"}}>
                            <button onClick={this.onRefreshData} className="btn btn-primary">Refresh Data</button>
                        </div>
                        
                    </div>
                   
                    <div style={{height: 400, width: 900}} className="ag-theme-balham">
                        <AgGridReact
                            // listening for events
                            onGridReady={this.onGridReady}
                            onRowSelected={this.onRowSelected}
                            onCellClicked={this.onCellClicked}
                            onModelUpdated={this.calculateRowCount}

                            // binding to simple properties
                            sideBar={this.state.sideBar}
                            quickFilterText={this.state.quickFilterText}

                            // binding to an object property
                            icons={this.state.icons}

                            // binding to array properties
                            rowData={this.state.rowData}

                            // no binding, just providing hard coded strings for the properties
                            // boolean properties will default to true if provided (ie suppressRowClickSelection => suppressRowClickSelection="true")
                            suppressRowClickSelection
                            rowSelection="multiple"
                            groupHeaders


                            // setting default column properties
                            defaultColDef={{
                                resizable: true,
                                sortable: true,
                                filter: true,
                                headerComponentFramework: SortableHeaderComponent,
                                headerComponentParams: {
                                    menuIcon: 'fa-bars'
                                }
                            }}>
                            <AgGridColumn field="id" headerName="id" width={30} sortable={false} suppressMenu filter={false} pinned>
                            </AgGridColumn>

                                <AgGridColumn field="name" width={150}
                                              cellEditorFramework={NameCellEditor}
                                             pinned editable/>
                                <AgGridColumn field="username" width={150}
                                              enableRowGroup enablePivot pinned editable/>
                                <AgGridColumn field="email" width={175} headerName="email" 
                                              pinned />

                             <AgGridColumn headerName="Company">
                                <AgGridColumn field="name" width={120} enableRowGroup enablePivot sortable={false}/>
                                <AgGridColumn field="catchPhrase" width={160} enableValue/>
                            </AgGridColumn> 
                             <AgGridColumn headerName="Address">
                                <AgGridColumn field="street" width={150} filter="text"/>
                                <AgGridColumn field="suite" width={150} filter="text"/>
                                <AgGridColumn field="city" width={500} filter="text"/>
                                <AgGridColumn field="zipcode" width={500} filter="text"/>

                            </AgGridColumn> 
                           
                        </AgGridReact>
                    </div>
                </div>
            </div>  
        );
    }
}
