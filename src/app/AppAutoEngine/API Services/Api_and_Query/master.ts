export class Master {
    masters = {
        "category":"mstserv/Apcategory_search?query=",
        "subcategory": "mstserv/Apsubcat_search?query=",
        "City": 'mstserv/new_city_search?query=',
        "District": 'mstserv/district_search?query=',
        "State":'mstserv/state_search?query=',
        "Pincode": 'mstserv/pincode_search?query='
    }
    subQuerys = {
        "category": "category_id"
    }
    files = {
        "files": "docserv/doc_download?entity_id=1&user_id=1/"
    }
}
