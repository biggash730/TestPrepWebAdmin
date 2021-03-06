import { Routes, AngularServices, AppServices, LookUpStores } from '../helpers/config_keys';
import {IRequestResult} from '../schemas/structure';
import {ILookUp } from '../schemas/entity_set';
import { IAuthService } from "../authentication/auth_service";
let _ = require("underscore")

interface ILookUpModel {
    name: string
    label: string
    route: string
    store: string
    api?: string
    hidden: boolean
}

class LookUps {
    static get Models(): Array<ILookUpModel> {
        return [
            { label: "Categories", name: "categories", store: LookUpStores.Categories, route: Routes.GenericSettings, hidden: false },
            { label: "Types", name: "types", store: LookUpStores.Types, route: Routes.GenericSettings, hidden: false },
            { label: "Kinds", name: "kinds", store: LookUpStores.Kinds, route: Routes.GenericSettings, hidden: false }
        ]
    };
}

interface ILookUpService {
    fetch(model: string): angular.IPromise<IRequestResult<Array<any>>>;
    queryTypes(params: any): angular.IPromise<IRequestResult<Array<any>>>;
    queryCategories(params: any): angular.IPromise<IRequestResult<Array<any>>>;
}

class LookUpService implements ILookUpService {
    
        static $inject = [AngularServices.Q, AngularServices.Http, AppServices.BaseApi, AppServices.AuthService];
    
        constructor(private $q: angular.IQService,
            private $http: angular.IHttpService,
            private baseUrl: string,
            private authService: IAuthService) {
        }
    
        fetch(lookUpStoreName: string) {
            let defer = this.$q.defer<IRequestResult<Array<any>>>()
            let lookUp = this.getModel(lookUpStoreName)
            this.$http.get(`${this.baseUrl}/${lookUp.api || lookUp.name}`).then((response: IRequestResult<Array<any>>) => {
                defer.resolve(response)
            })
    
            return defer.promise
        }

        queryTypes(params: any) {
            let defer = this.$q.defer<IRequestResult<Array<any>>>()
            this.$http.post(`${this.baseUrl}/types/query`,params).then((response: IRequestResult<Array<any>>) => {
                defer.resolve(response)
            })    
            return defer.promise
        }

        queryCategories(params: any) {
            let defer = this.$q.defer<IRequestResult<Array<any>>>()
            this.$http.post(`${this.baseUrl}/categories/query`,params).then((response: IRequestResult<Array<any>>) => {
                defer.resolve(response)
            })    
            return defer.promise
        }
    
        private getModelName(store: string) {
            let model = _.findWhere(LookUps.Models, { store: store })
            return model.name;
        }
    
        private getModel(store: string): ILookUpModel {
            let model = _.findWhere(LookUps.Models, { store: store })
            return model;
        }
    }

export {ILookUpModel, LookUpService, ILookUpService, LookUps}