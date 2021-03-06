﻿using DutchTreat.Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DutchTreat.Data
{
    public class DutchSeeder
    {
        private readonly DutchContext _context;
        private readonly IHostingEnvironment _hosting;
        private readonly UserManager<StoreUser> _userManager;

        public DutchSeeder(DutchContext context, IHostingEnvironment hosting, UserManager<StoreUser> userManager)
        {
            _hosting = hosting;
            _userManager = userManager;
            _context = context;
        }    

        public async Task Seed()
        {
            _context.Database.EnsureCreated();

            var user = await _userManager.FindByEmailAsync("jaymel@dutchtreat.com");

            if(user == null)
            {
                user = new StoreUser()
                {
                    FirstName = "Jaymel",
                    LastName = "Tapel",
                    UserName = "jaymel@dutchtreat.com",
                    Email = "jaymel@dutchtreat.com"
                };

                var result = await _userManager.CreateAsync(user, "P@ssw0rd!");
                if(result != IdentityResult.Success)
                {
                    throw new InvalidOperationException("Failed to create default user");
                }
            }

            if(!_context.Products.Any())
            {
                var filepath = Path.Combine(_hosting.ContentRootPath, "Data/art.json");
                var json = File.ReadAllText(filepath);
                var products = JsonConvert.DeserializeObject<IEnumerable<Product>>(json);

                _context.Products.AddRange(products);

                var order = new Order()
                {
                    OrderDate = DateTime.Now,
                    OrderNumber = "12345",
                    User = user,
                    Items = new List<OrderItem>()
                    {
                        new OrderItem()
                        {
                            Product = products.First(),
                            Quantity = 5,
                            UnitPrice = products.First().Price
                        }
                    }
                };

                _context.Orders.Add(order);

                _context.SaveChanges();
            }
        }
    }
}
