import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'; 

import { DataService, AlertService } from '../services';
import { Import, MetaData, GraphModel } from '../models';
import { IMPORT_COLS } from '../helpers/import.columns';  
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle } from 'ng-apexcharts';
 

@Component({
    selector: 'app-imports',
    templateUrl: './imports.component.html',
    styleUrls: ['./imports.component.scss']
})

export class ImportsComponent implements OnInit {
 
  series:ApexAxisChartSeries;
  chart: ApexChart;
  title:ApexTitleSubtitle;
  xaxis:ApexAxisChartSeries;

    importKeys = IMPORT_COLS;
    params: object;
    shipments: Import[]; 
    meta: MetaData;
    graphdata: GraphModel;
    GraphModel:any
    compaeData: [];
    shipmentFilters = []; 
    selectedItems:string [];
    coun:GraphModel[];
    pageIndex = 1;
    pageSize = 20; 
    viewPort = [1270, 550];
    viewPiePort = [1200, 500];
    formData: any ;
    countryTotal:any;
    country:any;
    show:boolean=true;
   
       chartOptions;    constructor(
            private router: Router,
            private route: ActivatedRoute,
            private alertService: AlertService,
            private ds: DataService
        ) { 
          this.selectedItems = new Array<string>();   
          this.chartOptions = {
            series: [
              {
                name: "Desktops",
                data: this.countryTotal
              }
            ],
            chart: {
              height: 350,
              type: "bar",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "Jan",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5
              }
            },
            xaxis: {
              categories:this.country
            }
          }; 
    
    }

    toggle(){
      this.show=!this.show;
    }
    
    
    //   var checkboxSelection = function (params) {
    //     return params.columnApi.getRowGroupColumns().length === 0;
    //   };
    //   var headerCheckboxSelection = function (params) {
    //     return params.columnApi.getRowGroupColumns().length === 0;
    //   };
    //  }
 
  
    ngOnInit() {
        const urlParams = combineLatest(
            this.route.params,
            this.route.queryParams,
            (params, queryParams) => ({ ...params, ...queryParams})
            
        );

        urlParams.subscribe(routeParams => {
            this.params = routeParams;
            this.params['mode'] = 'import'; 
            this.searchData(this.params, true);
            //this.onChecked(this.params, true);  
                
        });
        this.selectedItems = new Array<string>();  
        
        this.countrychart();
    }
 private countrychart():void{
   
   this.title={
     text:'Country'
   };
   this.series=[{ 
     data:this.country,
   }];
    
  // this.xaxis={
  //       categories:this.countryTotal
  //   }
   this.chart={
     type:'bar'
   }

 }
    Dashboard(params:object){
      this.ds.getGraph(params)
      .pipe(map(res=>res))
      .subscribe(
        res =>{
         this.GraphModel=res;
          this.coun= res.countryGraphas;
          	
      let country = res['countryGraphas'].map(res => res.Country)
      let totalConfirmed = res['countryGraphas'].map(res => res.TotalConfirmed)
      let totalDeaths = res['countryGraphas'].map(res => res.TotalDeaths)
      let newRecovered = res['countryGraphas'].map(res => res.NewRecovered)      
      let date = res['countryGraphas'].map(res => res.Date);
      console.log(country);
     
        }
      )
    }
    onSearchSubmit(form: any){
      const searchFormData = form.value;  
      console.log(this.formData)
      if(searchFormData.mode === 'imports') { 
          this.router.navigate(['/imports'], { queryParams: this.getFormParams(searchFormData)});
        
          
      } 
    }
      // onChecked(e: any, value:any, hscodeID) { 
      // if (e.target.checked) {
      //   console.log(value + "Chechked")
      //    this.selectedItems.push(value);
      // } else {
      //   console.log(value + "Unchechked");
      //   this.selectedItems =this.selectedItems.filter(m=>m!=value);
      // }  
      // console.log(this.selectedItems); 
      // let filtterValue=this.selectedItems.join()
      // this.params[hscodeID] = filtterValue;
      // this.pageIndex = 1;    
      //     this.ds.getImportData(this.params)
      //      .subscribe(
      //          ({ imports, meta }) => {
      //              console.log(imports)
      //              if (imports != null) { 
      //                   this.shipments=imports; 
      //                  this.meta = meta;
      //                   console.log(this.meta)
      //              } else {
      //                  alert('Null');
      //              }
      //              window.scroll(0, 320);
      //          },
      //      )
 
      //         }




    onChecked(e: any, value:any, key:any) { 
      if (e.target.checked) {
        console.log(value + "Chechked")
         this.selectedItems.push(value);
      } else {
        console.log(value + "Unchechked");
        this.selectedItems =this.selectedItems.filter(m=>m!=value);
      }  
      console.log(this.selectedItems); 
      let filtterValue=this.selectedItems.join()
      this.params[key] = filtterValue;
      this.pageIndex = 1;    
          this.ds.getImportData(this.params)
           .subscribe(
               ({ imports, meta }) => {
                   console.log(imports)
                   if (imports != null) { 
                        this.shipments=imports; 
                       this.meta = meta;
                        console.log(this.meta)
                   } else {
                       alert('Null');
                   }
                   window.scroll(0, 320);
               },
           )
 
              }

   
    getFormParams(formData: object){
        const formParams = {};
        Object.entries(formData).forEach(
            ([key, value]) => {
                if (value !== '' && key !== 'mode') {
                    formParams[key] = value;
                }
            }
        );
        return formParams;
    }
  
    // onChecked(name: any, event: any) {
    //   let { checked, value } = event.target;
    //   if (checked) {
    //     this.checkedItems.push(value);
       
    //     console.log(this.checkedItems)
    //   } else {
    //     let index = this.checkedItems.indexOf(value);
    //     if (index !== -1) this.checkedItems.splice(index, 1);
    //     console.log(this.checkedItems)
    //   }
    
    // }
    
    






























    onSwitchTab(tab: any) {
        // if (tab.for === 'charts') {
        //     this.ds.getImportCharts(this.params)
        //     .pipe(
        //         map(
        //             data =>  data[0]
        //         )
        //     )
        //     .subscribe(
        //         (data) => {
        //             this.graphdata = data;
        //         }
        //     );
        // }
        if(tab.for === 'Dashboard'){
          this.ds.getGraph(this.params)
      .pipe(map(res=>res))
      .subscribe(
        res =>{
         this.GraphModel=res;
          this.coun= res.countryGraphas;
          // console.log(this.coun);
      this.country = res['countryGraphas'].map(res => res.name);
      this.countryTotal = res['countryGraphas'].map(res => res.total)
      let totalConfirmed = res['countryGraphas'].map(res => res.TotalConfirmed)
      let totalDeaths = res['countryGraphas'].map(res => res.TotalDeaths)
      let newRecovered = res['countryGraphas'].map(res => res.NewRecovered)      
      let date = res['countryGraphas'].map(res => res.Date);
      console.log(this.country);
      console.log(this.countryTotal);
    
        })
    }
  }
    searchData(params: object, updateFilter?: boolean) {
      params['pageIndex'] = this.pageIndex;
      params['pageSize'] = this.pageSize;
      this.ds.getImportData(params)
          .subscribe(
              ({ imports, meta }) => {
                  console.log(imports)
                  if (imports != null) { 
                       this.shipments=imports; 
                      this.meta = meta;
                       console.log(this.meta)
                  } else {
                      alert('No records found');
                  }
                  window.scroll(0, 320);
              },
          error => {
              this.shipments = null;
              this.meta = null;
              alert('No records found')
          }
      );
      if(updateFilter) {
          this.ds.getImportFilters(params)
          .pipe(map(data => data))
          .subscribe(
              data => {
                  this.shipmentFilters = data; 
                  console.log(this.shipmentFilters)
              }
          )
      }
     
  }
  
  // onChecked(e: any, value:string, key:any) {
  //   //let { checked, value} = event.target;
  //   if (e.target.checked) {
  //     console.log(value + "Chechked")
  //      this.selectedItems.push(value);
  //   } else {
  //     console.log(value + "Unchechked");
  //     this.selectedItems =this.selectedItems.filter(m=>m!=value);
  //   } 
    
  //   console.log(this.selectedItems);}
    // filterData(e: any, name: any, value: any) {
    //   if (e.target.checked) {
    //     console.log(value + "Chechked")
    //      this.selectedItems.push(value);
    //   } else {
    //     console.log(value + "Unchechked");
    //     this.selectedItems =this.selectedItems.filter(m=>m!=value);
    //   } 

    //     this.params[name] = value;
    //     this.pageIndex = 1;
    //    // this.searchData(this.checkedItems, true);
    //     const qParams: object = {};
    //     qParams[name] = value;
    //     this.router.navigate([], { queryParams: qParams, queryParamsHandling: 'merge' });
    // }
    goToPage(n: number): void {
        this.pageIndex = n;
        this.searchData(this.params);
    }
    onNext(): void {
        this.pageIndex++;
        this.searchData(this.params);
    }
    onPrev(): void {
        this.pageIndex--;
        this.searchData(this.params);
    }
    onResize(event) {
        const width = event.target.innerWidth;
        this.viewPort = [width - 110, 550];
        this.viewPiePort = [width - 120, 550];
    }
}
 