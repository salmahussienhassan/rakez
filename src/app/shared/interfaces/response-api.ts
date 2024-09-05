export interface ResponseApi<T> {
    statusCode: number;
    message: string;
    data :T;
}

export interface DropdownValues{
    id: number;
    value: string; 
}

export interface verifyCode{
    imageUrl: string;
    code: string;
}

export interface WhyRakez{
    id: number;
    title: string;
    description: string;
    image: string;
  }
  export interface Values{
    title: string;
    description: string;
  }
  export interface Services{
    title: string;
    description: string;
    image: string;
  }
  export interface Partner{
    image: string;
  }

// registration
export interface registrationResponse{
    picture: string;
    phoneNumber: string;
    birthday: string;
    displayName: string;
    email: string;
    role: string;
    token: string;
    tokenExpiry: string;
}

// profile
export interface tickets{
  id: number,
  ticketId: string,
  description: string,
  attachments:string,
  status: number,
  userId: string,
  phoneNumber: string,
  title:string
  createdDate:string
}