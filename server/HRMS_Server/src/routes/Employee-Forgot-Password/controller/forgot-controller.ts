import { Request, Response } from 'express';
import { ForGotService } from '../service/fogot-pwd-service';

export class ForgotController {
  public static validateEmail(req: Request, res: Response) {
    const tammina = ForGotService.emailValidation(req, res);
  }

  public static changePawd(req: Request, res: Response) {
    const tammina = ForGotService.changePassword(req, res);
  }

  public static thisIsSignUp(req: Request, res: Response) {
    const thisissignup = ForGotService.thisissignup(req, res);
  }
  public static asatph(
    req: Request,
    res: Response
  ) {
    const thisissignup = ForGotService.after_signup_adding_the_password_here(
      req,
      res
    );
  }
}
