import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';

export const SlideAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'height': '*', 'opacity': '1'
        })),
        state('out', style({
            'height': '0px', 'opacity': '0'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'height': '0px'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('600ms ease-in-out', style({
                'height': '*'
            })),
            animate('800ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]
