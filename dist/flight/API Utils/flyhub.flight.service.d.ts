export declare class FlyHubService {
    private readonly username;
    private readonly apiKey;
    private readonly apiUrl;
    constructor();
    getToken(): Promise<string>;
    searchFlights(data: any): Promise<any>;
}
