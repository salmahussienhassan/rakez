import { Routes } from '@angular/router';
import { CarDetailsComponent } from './core/components/car/car-details/car-details.component';
import { CarQuotationComponent } from './core/components/car/car-quotation/car-quotation.component';
import { PaymentDoneComponent } from './core/components/car/payment-done/payment-done.component';
import { HomeComponent } from './core/components/home/home.component';
import { AccountInfoComponent } from './core/components/user/profile/children/account-info/account-info.component';
import { AddressComponent } from './core/components/user/profile/children/address/address.component';
import { BillsComponent } from './core/components/user/profile/children/bills/bills.component';

import { DocumentsComponent } from './core/components/user/profile/children/documents/documents.component';
import { OffersComponent } from './core/components/user/profile/children/offers/offers.component';
import { ProgramPromotionsComponent } from './core/components/user/profile/children/program-promotions/program-promotions.component';
import { StatisticsComponent } from './core/components/user/profile/children/statistics/statistics.component';
import { SupportComponent } from './core/components/user/profile/children/support/support.component';
import { VehiclesComponent } from './core/components/user/profile/children/vehicles/vehicles.component';
import { ProfileComponent } from './core/components/user/profile/profile.component';
import { SecuritySettingsComponent } from './core/components/user/profile/children/security-settings/security-settings.component';
import { ChangePasswordProfileComponent } from './core/components/user/profile/children/change-password-profile/change-password-profile.component';
import { LoginComponent } from './core/components/user/registration/login/login.component';
import { RegisterComponent } from './core/components/user/registration/register/register.component';
import { CheckEmailComponent } from './core/components/user/registration/check-email/check-email.component';
import { LoginVerifyComponent } from './core/components/user/registration/login-verify/login-verify.component';
import { OtpComponent } from './core/components/user/registration/otp/otp.component';
import { ResetPasswordComponent } from './core/components/user/registration/reset-password/reset-password.component';
import { CarCheckoutComponent } from './core/components/car/car-checkout/car-checkout.component';
import { ContactusComponent } from './shared/components/contactus/contactus.component';
import { loginGuard } from './shared/guards/login.guard';
import { TermsConditionsComponent } from './shared/components/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { RecommendedQuestionsComponent } from './shared/components/recommended-questions/recommended-questions.component';

export const routes: Routes = [
  {path: '',redirectTo:'ar/home',pathMatch:'full'},
  {path: ':lang/login',component:LoginComponent,title:'Login'},
  {path: ':lang/register',component:RegisterComponent,title:'Register'},
  {path: ':lang/check-email',component:CheckEmailComponent,title:'Check Email'},
  {path: ':lang/login-verify',component:LoginVerifyComponent,title:'  Login Verify'},
  {path: ':lang/otp',component:OtpComponent,title:'Otp'},
  {path: ':lang/contact-us',component:ContactusComponent,title:'ContactUs'},
  {path: ':lang/reset-password',component:ResetPasswordComponent,title:'Reset Password'},
  {path:':lang/home',component:HomeComponent,title:'Home'},
  {path: ':lang/car-details', component:CarDetailsComponent,title:'Car Details'},
  {path: ':lang/car-quotation', component:CarQuotationComponent,title:'Car Quotation'},
  {path:':lang/car-checkout',component:CarCheckoutComponent,title:'Car Checkout'},
  {path:':lang/payment-done',component:PaymentDoneComponent,title:'Payment Done'},
  {path: ':lang/profile', component:ProfileComponent ,canActivate:[loginGuard],
      children:[
        { path: '', redirectTo: 'accountInfo', pathMatch: 'full' },
        {path :'accountInfo', component:AccountInfoComponent, title :'accountInformation'},
        {path :'statistics', component:StatisticsComponent, title :'statistics'},
        {path :'security-settings', component:SecuritySettingsComponent, title :'securitySettings'},
        {path :'documents', component:DocumentsComponent, title :'documents'},
        {path :'support', component:SupportComponent, title :'support'},
        {path :'vehicles', component:VehiclesComponent, title :'vehicles'},
        {path :'bills', component:BillsComponent, title :'bills'},
        {path :'address', component:AddressComponent, title :'address'},
        {path :'program-promotions', component:ProgramPromotionsComponent, title :'program-promotions'},
        {path :'offers', component:OffersComponent, title :'offers'},
        {path :'change-password-profile', component:ChangePasswordProfileComponent, title :'change password profile'},
      ],
  },
  {path: ':lang/terms-conditions',component:TermsConditionsComponent,title:'Terms & Conditions'},
  {path: ':lang/privacy-policy',component:PrivacyPolicyComponent,title:'Privacy Policy'},
  {path: ':lang/recommended-question',component:RecommendedQuestionsComponent,title:'Recommended Questions'},
];
