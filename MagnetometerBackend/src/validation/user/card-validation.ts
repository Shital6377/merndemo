import {NextFunction, Request, Response} from "express"
import validator from "../validate_";

const store = async (req: Request, res: Response, next: NextFunction) => {
    let id: any = 0;
	if (req.body.id) {
		id = req.body.id
	}
    const validationRule = {
        "number": "required",
        "exp_date":"required",
        "cvc":"required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    store,
}