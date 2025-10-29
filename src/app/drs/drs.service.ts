import { Injectable, Type } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

const url = environment.apiURL;

@Injectable({
  providedIn: "root",
})
export class DrsService {
  idleState = 'Not started.';
  timedOut = false;
  constructor(private idle: Idle,private http: HttpClient, private spinner: NgxSpinnerService) {}
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public reportdrop() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_master_dropdown";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public report_master_summary(page,code,name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_master?page=" + page + "&code="+ code+"&name="+name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  // public report_master_tab(page,code,name) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let urlvalue = url + "drsservice/report_master?page=" + page + "&code="+ code+"&name="+name;
  //   return this.http.get(urlvalue, {
  //     headers: new HttpHeaders().set("Authorization", "Token " + token),
  //   });
  // }

  public drs_report_header_summary(page,report_master,name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_header?page=" + page + "&report_master="+report_master + "&name="+name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public drs_report_header_tab(page,report_master,name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_header?page=" + page + "&report_master="+report_master + "&name="+name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  public drs_report_group_summary(page,header,name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_group?page=" + page+ "&header="+ header + "&name="+name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  // public drs_report_group_tab(page,header,name) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let urlvalue = url + "drsservice/report_group?page=" + page+ "&header="+ header + "&name="+name;
  //   return this.http.get(urlvalue, {
  //     headers: new HttpHeaders().set("Authorization", "Token " + token),
  //   });
  // }

  public drs_report_type_summary(page,report_group,name, flag,head_group_id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_type?page=" + page+"&report_group=" +report_group+"&name=" +name+"&flag=" +flag+"&header_id="+head_group_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  // public drs_report_type_tab(page,report_group,name) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let urlvalue = url + "drsservice/report_type?page=" + page+"&report_group=" +report_group+"&name="+name;
  //   return this.http.get(urlvalue, {
  //     headers: new HttpHeaders().set("Authorization", "Token " + token),
  //   });
  // }
  public drs_schdular_master_summary(page,report_type,name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/schedulermaster?page=" + page + "&report_type="+report_type + "&name="+name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }

  // public drs_schdular_master_tab(page,report_type,name) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let urlvalue = url + "drsservice/schedulermaster?page=" + page + "&report_type="+report_type + "&name="+name;
  //   return this.http.get(urlvalue, {
  //     headers: new HttpHeaders().set("Authorization", "Token " + token),
  //   });
  // }
  public drs_schdular_type_summary(page,scheduler,name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/schedulertype?page=" + page + "&scheduler="+scheduler + "&name="+name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public reportmasterdrop(name,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_master_dropdown?name=" + name +  "&page=" +page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public reporthead_dropdown(name,page,report_master) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_header_dropdown?name=" +name + "&page=" +page + "&report_master=" +report_master;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public reportgroup_dropdown(name,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_group_dropdown?name=" + name + "&page=" +page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public reporttype_dropdown(name,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_type_dropdown?name=" + name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Schdularmaster_dropdowns(quary,page,upper_key,sub_key) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_schedulermaster_dropdown?page="+page+"&query="+quary+"&upper_hierarchy="+upper_key+"&sub_level="+sub_key;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Schdularmaster_dropdown(quary,page) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_schedulermaster_dropdown?page="+page+"&query="+quary;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  // public Schdulartypedropdown() {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let urlvalue = url + "drsservice/report_schedulermaster_dropdown";
  //   return this.http.get(urlvalue, {
  //     headers: new HttpHeaders().set("Authorization", "Token " + token),
  //   });
  // }
  reportmastercreatedata(reportmaster) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "drsservice/report_master", reportmaster, {
      headers: headers,
    });
  }
  reportheadercreatedata(reporthead) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "drsservice/report_header", reporthead, {
      headers: headers,
    });
  }
  reportgroupcreatedata(report_group) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "drsservice/report_group", report_group, {
      headers: headers,
    });
  }
  reporttypecreatedata(reporttype) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "drsservice/report_type", reporttype, {
      headers: headers,
    });
  }
  schdularmastercreatedata(schdularval) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      url + "drsservice/schedulermaster",
      schdularval,
      {
        headers: headers,
      }
    );
  }
  schdulartypecreatedata(schdulartype) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "drsservice/schedulertype", schdulartype, {
      headers: headers,
    });
  }
  // sort_validate(PARAMSSS) {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.post<any>(url + "drsservice/gl_short_order", PARAMSSS, {
  //     // url + "drsservice/report_master/" + report_id + "?status=" + status,

  //     headers: headers,
  //   });
  // }
  public ReportMater_edit(id) {
    console.log("id", id)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_master/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public ReportMater_view(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_master/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public ReportMater_delete(report_id, status): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "drsservice/report_master/" + report_id + "?status=" + status,
      { headers: headers }
    );
  }
  public ReportHeadrer_edit(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_header/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public ReportHeadrer_view(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_header/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public ReportHeadrer_delete(report_id, status): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "drsservice/report_header/" + report_id + "?status=" + status,
      { headers: headers }
    );
  }
  public Reportgroup_edit(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_group/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Reportgroup_view(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_group/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Reportgroup_delete(report_id, status): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "drsservice/report_group/" + report_id + "?status=" + status,
      { headers: headers }
    );
  }
  public Reporttypeedit(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_type/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Reporttype_view(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/report_type/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Reporttype_delete(report_id, status): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "drsservice/report_type/" + report_id + "?status=" + status,
      { headers: headers }
    );
  }
  public SchdularMater_edit(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/schedulermaster/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public SchdularMater_view(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/schedulermaster/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public SchdularMater_delete(report_id, status): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "drsservice/schedulermaster/" + report_id + "?status=" + status,
      { headers: headers }
    );
  }
  public Schdulartypeedit(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/schedulertype/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Schdulartype_view(id) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "drsservice/schedulertype/" + id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  }
  public Schdulartype_delete(report_id, status): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      url + "drsservice/schedulertype/" + report_id + "?status=" + status,
      { headers: headers }
    );
  }
  public Reportfile_download(report_id, file_type): Observable<any> {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "drsservice/fetch_report_amount?id=" + report_id + "&file_type=" + file_type,     
      { headers: headers,responseType: 'blob' as 'json' }      
    );
  }
  // public master_download(id): Observable<any> {
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.get<any>(
  //     url + "drsservice/report_master_excelsheet?master_id=" + id,     
  //     { headers: headers,responseType: 'blob' as 'json' }      
  //   );
  // }
  public docaws_summary(summary,page) {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue = url + 'drsservice/drs_document_summary?status='+summary.status+'&created_date='+summary.created_date+'&filename='+summary.filename+'&page='+page;
    return this.http.post<any>(urlvalue,{}, { 'headers': headers })
  }
  public drsreport(gen) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue=url+"drsservice/drs_file_download?gen_key="+gen
    return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
    )}
  public reportdownload_trigger(fileparams) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue=url +'drsservice/drsfile_insert_triggger'
    return this.http.post(urlvalue,fileparams, { 'headers' :headers }
    )}

    public report_type_list(drsparams){
      console.log("drsparams",drsparams)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = drsparams
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/report_reportype_list", params, {
        headers: headers,
      });
    }
    public report_summary_master(search_val,page) {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let create_date = search_val.created_date
      let name = search_val.name
      let urlvalue = url + "drsservice/report_master?page=" + page+"&created_date="+create_date+"&name="+name;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }
    public report_header_level(drsparams) {
      console.log("drsparams",drsparams)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = drsparams
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/report_header_list", params, {
        headers: headers,
      });
    }
    public report_group_list(drsparams){
      console.log("drsparams",drsparams)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = drsparams
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/report_group_list", params, {
        headers: headers,
      });
    }
    public scheduler_type_list(drsparams){
      console.log("drsparams",drsparams)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = drsparams
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/report_schedulertype_list", params, {
        headers: headers,
      });
    }
    public scheduler_master_list(drsparams){
      console.log("drsparams",drsparams)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = drsparams
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/report_schedulermaster_list", params, {
        headers: headers,
      });
    }
    public Schdular_master_summary(report_type,name,page) {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/schedulermaster?report_type="+report_type + "&name=" + name + "&page=" + page ;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }
    public schedule_add(drsparams){
      console.log("drsparams",drsparams)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = drsparams
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/schedulermaster", params, {
        headers: headers,
      });
    }

    public schdular_search_summary(id,name,page) {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/schedulermaster?parent="+id+ "&name=" + name + "&page=" + page ;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    }
    Catagorys(catdata,page){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "mstserv/categoryname_search?query="+ catdata + '&page=' + page;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 
    SortOrder(sort_order,page){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/sort_order_dropdown?sort_order="+ sort_order + '&page=' + page;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    Schedules_summary(name,page,map_toschedule){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/schedulermaster?page=" + page + '&name=' + name + "&map_toschedule="+map_toschedule;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public Edit_table(Id,params){
      console.log("drsparams",params)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      // let params = params
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/schedulermaster?&id=" + Id ,params, {
        headers: headers,
      });
    }

    public create_summary(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/schedulermaster", PARAMS, {
        headers: headers,
      });
    }

    public drs_summary(PARAMS,id){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
      if(id==99){
      return this.http.post<any>(url + "drsservice/tb_audit_totalamt?flag="+1, PARAMS, {
        headers: headers,
      });
      }else{
          return this.http.post<any>(url + "drsservice/common_master_summary?flag="+1, PARAMS, {
        headers: headers,
      });
    }
    }
    // tb_audit_totalamt
    public total_summary(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/tb_audit_totalamt?flag="+1, PARAMS, {
        headers: headers,
      });
    }
     public rtb_summary(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/audit_entry_reportlist?flag="+1, PARAMS, {
        headers: headers,
      });
    }
    audit_entry_reportlist

    public audit_col_summary(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/audit_entry_reportlist?flag="+1, PARAMS, {
        headers: headers,
      });
    }

    public document_upload(PARAMS,flag,value){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      // let json = Object.assign({}, PARAMS);
      let formData = new FormData();
      // formData.append("data", JSON.stringify(json));
      formData.append("file", PARAMS);
      const headers = { Authorization: "Token " + token };
      if(value==='TB'){
          return this.http.post<any>(url + "drsservice/upload_cbs_template?flag=" + flag, formData, {
        headers: headers,
      });
    }else{
        return this.http.post<any>(url + "drsservice/mastertoscheduler_data_insert", formData, {
        headers: headers,
      });
    }
    }
    // public document_uploads(flag){
    //   const getToken = localStorage.getItem("sessionData");
    //   let tokenValue = JSON.parse(getToken);
    //   let token = tokenValue.token;
    //   const headers = { Authorization: "Token " + token };
    //   let urlvalue = url + 'drsservice/upload_cbs_template?flag='+flag;
    //   return this.http.post<any>(urlvalue,{}, { 'headers': headers }, )  
    //   // return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }

    // }
    public document_uploads(flag,value) {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = new HttpHeaders({
        'Authorization': 'Token ' + token
      });
      // const headers = { 'Authorization': 'Token ' + token }
    if(value==='TB'){
      let urlvalue=url+"drsservice/upload_cbs_template?flag="+flag
      return this.http.post(urlvalue,{}, { headers, responseType: 'blob' as 'json' }
      )
    }else{
       let urlvalue=url+"drsservice/masters_file_template_download"
      return this.http.post(urlvalue,{}, { headers, responseType: 'blob' as 'json' }
      )
    }
    }
    

    public fetch_template(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/fetch_template", PARAMS, {
        headers: headers,
      });
    }

    Currency_summary(name,page,status){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/currency_format?page=" + page + '&name=' + name + '&status=' + status;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public Currency_create(PARAMS){ 
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/currency_format", PARAMS, {
        headers: headers,
      });
    }

    public Currency_delete(Currency_id, status): Observable<any> {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.delete<any>(
        url + "drsservice/currency_format/" + Currency_id + "?status=" + status,
        { headers: headers }
      );
    }

    public Exception_delete(Exception_id, status): Observable<any> {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.delete<any>(
        url + "drsservice/exception_sts_update?&id=" + Exception_id + '&status=' + status,
        { headers: headers }
      );
    }


    Exception_finyear(){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "pprservice/fetch_finyear";
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 
    Exception_summary(page,name,schedule,finyear){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/exception_schedule?page=" + page+ '&name=' + name+ '&schedule=' + schedule+ '&finyear=' +finyear;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public Exception_submit(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
         return this.http.post<any>(url + "drsservice/exception_schedule", PARAMS, {
        headers: headers,
      });
    }

    public drs_summary_pdfdownload(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/common_master_summary?flag="+2 + "&file_format="+"pdf", PARAMS, {
        headers: headers
      });
    }
    public drs_summary_exceldownload(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };

          return this.http.post<any>(url + "drsservice/common_master_summary?flag="+2 + "&file_format="+"xlsx", PARAMS, {
        headers: headers
      });
    }

    public getfinyeardropdown(query,pagenumber) {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (query === null) {
        query = "";
        console.log('calling empty');
      } 
      let urlvalue = url + 'pprservice/fetch_finyear';
      
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }

    public getbranchdropdown(query,pagenumber) {
      console.log(query,"Branch Code")
      let Bra
      if(typeof query== "object"){
        Bra =query.code
      }else{
        Bra = query
      }
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if (query === null) {
        query = "";
        console.log('calling empty');
      }
      let urlvalue = url + 'usrserv/search_employeebranch?query=' + Bra+"&page="+pagenumber;
      // let urlvalue = url + 'pprservice/budget_employeebranch?query=' + query+"&page="+pagenumber;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }

    public Audict_submit(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
         return this.http.post<any>(url + "drsservice/auditentries_create", PARAMS, {
        headers: headers,
      });
    }
    // mstserv/gl_search
    GL_dropdown(glno, page){
      console.log(glno,"GL No:")
      let GL_No
      if(typeof glno== "object"){
         GL_No =glno.glno
      }else{
        GL_No = glno
      }
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "mstserv/gl_search?glno=" +GL_No + '&page=' + page;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    Audit_summary(glno,page,branchcode,transactiondate,status, flag, stage, approvedate, finyear,month){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/auditentries_create?page=" + page+ '&glno=' + glno+ '&branchcode=' +branchcode+ '&transactiondate=' +transactiondate+ '&status=' +status+ '&flag=' +flag+ '&stage=' +stage+ '&approvedate=' +approvedate+ '&finyear=' +finyear+'&month='+month;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    Notional_summary(glno,page,branchcode,transactiondate,status,flag,stage, approvedate, finyear){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/auditentries_create?page=" + page+ '&glno=' + glno+ '&branchcode=' +branchcode+ '&transactiondate=' +transactiondate+ '&status=' +status+ '&flag=' +flag+ '&stage=' +stage+ '&approvedate=' +approvedate+ '&finyear=' +finyear;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public Checker_data(PARAMS){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let params = PARAMS
      const headers = { Authorization: "Token " + token };
         return this.http.post<any>(url + "drsservice/audit_entry_update", PARAMS, { 
        headers: headers,
      });
    }

    public doc_upload(PARAMS,flag,stage){
      console.log("drsparams",PARAMS)
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      // let json = Object.assign({}, PARAMS);
      let formData = new FormData();
      // formData.append("data", JSON.stringify(json));
      formData.append("file", PARAMS);
      const headers = { Authorization: "Token " + token };
          return this.http.post<any>(url + "drsservice/auditentries_fileupload?flag=" +flag+ "&stage=" + stage,  formData, {
        headers: headers,
      });
    }

    Stage_drop(stage,page){
      let Stage
      if(typeof stage== "object"){
         Stage =stage.id
      }else{
        Stage = stage
      }
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/audit_dropdown_stage?stage=" + Stage + '&page=' + page;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 
    Stage_drops(stage,page, flag,date){
      let Stage
      if(typeof stage== "object"){
         Stage =stage.id
      }else{
        Stage = stage
      }
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/audit_dropdown_stage?stage=" + Stage + '&page=' + page + '&flag=' +flag +'&date='+date;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public Edit_fetch(Id){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/audit_entry/" +Id;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public Screen_download(status, branchcode,transactiondate,stage,approvedate,flag,finyear,glno): Observable<any> {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.get<any>(
        url + "drsservice/audit_notional_download?status=" + status + "&branchcode=" + branchcode + "&transactiondate=" + transactiondate + "&stage=" + stage + "&approvedate=" + approvedate + "&flag=" + flag + "&finyear=" + finyear + "&glno=" + glno,     
        { headers: headers,responseType: 'blob' as 'json' }      
      );
    }

    public Stage_end(page,flag,finyear,month){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/audit_dropdown_stage?page=" +page+ "&flag=" + flag+ "&finyear=" +finyear+'&month='+month;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public TB_summarys(glno,branchcode,Description,pagenumber,dates){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let urlvalue = url + "drsservice/fetch_tb_records?branch_code=" +branchcode+ "&gl_description=" + Description+ "&glno=" +glno+ "&page=" + pagenumber+"&fis_mis_date=" +dates;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders().set("Authorization", "Token " + token),
      });
    } 

    public TB_Delete(date, status): Observable<any> {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.delete<any>(
        url + "drsservice/update_tb_status?date=" + date + "&status=" + status,
        { headers: headers }
      );
    }
    
     public audit_template_download(){
      let params={}
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.post<any>(url + "drsservice/audit_template_download",params, {
        headers: headers,responseType: 'blob' as 'json'
      });
    }
     public QuarterSummary(data){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.post<any>(url + "drsservice/Quaterwise_tb",data, {
        headers: headers
      });
    }
     public QuarterParticularGet(data){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.post<any>(url + "drsservice/Quarterwise_schedule_master_list",data, {
        headers: headers
      });
    }
     public QuarterParticularSubListGet(data){
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.post<any>(url + "drsservice/Quarterwise_scheduler_sublevel_list",data, {
        headers: headers
      });
    }
}
  