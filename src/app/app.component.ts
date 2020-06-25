import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from './authorization/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.autoAuthUser();
    }
}
