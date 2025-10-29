export class Address{
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipCode: number;
    country: string;
  
    /**
  
     * transform address object to string, it's useful to display data into input text.
  
     */
  
    public toStringFormat(){
      return `${this.addressLine1} ${this.addressLine2}, 
              ${this.zipCode} ${this.city}, ${this.country}`;
    }
  }