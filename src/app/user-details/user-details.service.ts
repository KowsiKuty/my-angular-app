import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const vowUrl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  foo:any=null

  constructor(private http: HttpClient) { }

  public Headers(){
    return { 'Authorization': 'Token ' + JSON.parse(localStorage.getItem("sessionData")).token }

  }
    //

    public login(): Observable<any> {
      // this.reset();
      const headers = { 'content-type': 'application/json' }
      const userdata = {
        'username': 'emp001',
        'password': '1234',
        'entity_id': 1
      }
      // const userdata = {
      //   'username': user.username,
      //   'password': btoa(user.password),
      //   'entity_id': clientname
      // }
      const body = JSON.stringify(userdata);
      return this.http.post(vowUrl + 'usrserv/auth_token' + '', body, { 'headers': this.Headers()})
    }

      // user Creation 
      public userCreationForm(details: any, portal_Id:any): Observable<any> {
        // const getToken = localStorage.getItem("crmuserdata")
        // let tokenValue = JSON.parse(getToken);
        // let token = tokenValue.token
        let json_port = {
          "port_id": portal_Id
        }
        let jsonValue = Object.assign({}, details,json_port)
        let data = JSON.stringify(jsonValue)
        console.log("usercreation", data)
        // const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(vowUrl + 'usrserv/portal_user', data,{'headers': this.Headers()})
      }

       // user Summary 
       public GetUser_SummaryDetails(): Observable<any> {
        // const getToken = localStorage.getItem("crmuserdata") 
        // let tokenValue = JSON.parse(getToken);
        // let token = tokenValue.token
        // let json_port = {
        //   "port_id": 1
        // }
        // let jsonValue = Object.assign({}, details,json_port)
        // let data = JSON.stringify(jsonValue)
        // console.log("usercreation", data)
        
        return this.http.get<any>(vowUrl + 'usrserv/portal_user', {'headers': this.Headers()})
      }



        // role dropdown
  public getRole_Type(): Observable<any> {
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // let data = JSON.stringify(bio)
    // console.log("biojson", data)
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'usrserv/vow_role',{'headers': this.Headers()})
  }

  public creategroup(json): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token    
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + "venserv/create_group" , json, { 'headers': this.Headers()})

  }  

  public creategroupmapping(json): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }

    if(json?.id == undefined){
      return this.http.post<any>(vowUrl + "venserv/create_groupmapping?action=create" , json, { 'headers': this.Headers()})

    }
    else{
      return this.http.post<any>(vowUrl + "venserv/create_groupmapping?action=update" , json, { 'headers': this.Headers()})

    }

  }

  public getsupplierdata(vendorid,value): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(vowUrl + "venserv/vendor_supplierbranch_Details?vendor_id="+vendorid+"&query="+value, { 'headers': this.Headers()})
  }

  public groupsummary(vendorid,page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/create_group?vendor_id="+vendorid+"&page="+ page, { 'headers': this.Headers()})

  }  

  public groupmapsummary(id,page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/group_empl_map_summary/"+id+"?page="+ page, { 'headers': this.Headers()})

  } 

  public get_EmployeeList(empkeyvalue): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'usrserv/searchemployee?query=' + empkeyvalue, { 'headers': this.Headers()})
  }

  public getparticulargroupmapping(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'venserv/fetch_groupmapping/' + id, { 'headers': this.Headers()})
  }

  public getparticulargroup(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'venserv/fetch_group/' + id, { 'headers': this.Headers()})
  }
  
  public createrule(json): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token    
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + "venserv/create_grouprule" , json, { 'headers': this.Headers()})
  } 
  
  public rulesummary(vendorid,page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/create_grouprule?vendor_id="+vendorid+"&page="+ page, { 'headers': this.Headers()})

  }  

  public getparticularrule(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'venserv/fetch_grouprule/' + id, { 'headers': this.Headers()})
  }

  public getrule(): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "prodserv/rule_type", { 'headers': this.Headers()})
  }

  public getproduct(groupid,value): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.get<any>(vowUrl + "venserv/groupproduct_based_product?action=summary"+"&vendorgroup_id="+groupid+"&name="+value, { 'headers': this.Headers()})

  }
  public getparticulargroupdelete(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vowUrl + 'venserv/fetch_groupmapping/' + id, { 'headers': this.Headers()})
  }

  public creategroupmappingsubmit(id,json): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
     return this.http.post<any>(vowUrl + "venserv/group_update?group="+id , json, { 'headers': this.Headers()})
  }

  public getdynamicrulevalues(id,value): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/get_value_type_value?rule_type="+id+"&query="+value, { 'headers': this.Headers()})
  }

  public getvendorgroupdropdownsearch(value,page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/create_vendorgroup?name="+value+"&page="+page, { 'headers': this.Headers()})
  }

  public getparticulargroupmapdata(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/group_mapping_get/"+id, { 'headers': this.Headers()})
  }

  public getvendorbasedgroup(id,value): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/vendor_basedgroup?vendor_id="+id, { 'headers': this.Headers()})
  }

  public getvendorlimit(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/vendor_lead_limit/"+id, { 'headers': this.Headers()})
  }

  public getportaluseremployee(vendorid,empkeyvalue): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("sessionData");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'venserv/vendor_portal_emp_get?vendor_id='+vendorid+'&name=' + empkeyvalue, { 'headers': this.Headers() })
  }

  

  public getparticularemployeedeleteingroupmapping(id): Observable<any> {
 
    return this.http.delete<any>(vowUrl + "venserv/fetch_groupmapping/"+id, { 'headers': this.Headers()})
  }
}
