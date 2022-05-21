import { BehaviorSubject, timeout } from "rxjs";

export class ModalService{

    private static instance: ModalService;

    private _modalType$: BehaviorSubject<ModalType> = new BehaviorSubject<ModalType>(null);
    private resolver: any;
    private constructor(){}

    public static getInsance(){
        if(!this.instance){ this.instance = new ModalService(); }
        return this.instance;
    }

    private close(){
        console.log("*** CLOSE ***")
        if(this.resolver){ this.resolve({exitCode: ModalExitCode.NO_CHOICE}); }
        this.modalType$.next(null);
    }

    public get modalType$(): BehaviorSubject<any>{
        return this._modalType$;
    }

    public getResolver(): any{
        return this.resolver;
    }

    public resolve(data: ModalResponse): void{
        this.resolver(data);
    }

    public async openModal(modalType: ModalType): Promise<ModalResponse>{
        this.close();
        await timeout(100); //Must wait resolve
        const promise = new Promise<ModalResponse>((resolve) => { this.resolver = resolve; });
        promise.then(() => this.close());
        this.modalType$.next(modalType);
        return await promise;
    }

}

export enum ModalType {
    STEAM_LOGIN = "STEAM_LOGIN",
    GUARD_CODE = "GUARD_CODE",
}

export enum ModalExitCode {
    NO_CHOICE = -1,
    COMPLETED = 0,
    CLOSED = 1,
    CANCELED = 2,
}

export interface ModalResponse {
    exitCode: ModalExitCode,
    data?: any
}